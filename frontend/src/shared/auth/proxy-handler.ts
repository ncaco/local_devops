import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

function clearAuthCookies(response: NextResponse) {
  const cookieNames = [
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.csrf-token",
    "__Host-next-auth.csrf-token",
    "next-auth.callback-url",
    "__Secure-next-auth.callback-url",
  ];

  cookieNames.forEach((name) => {
    response.cookies.set(name, "", { maxAge: 0, path: "/" });
  });
}

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);

  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  const backendApiUrl = process.env.BACKEND_API_URL;
  const userId = typeof token.id === "string" ? token.id : null;
  if (!backendApiUrl || !userId) {
    const response = NextResponse.redirect(loginUrl);
    clearAuthCookies(response);
    return response;
  }

  const verifyResponse = await fetch(`${backendApiUrl}/api/v1/auth/session-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
    cache: "no-store",
  });

  if (!verifyResponse.ok) {
    const response = NextResponse.redirect(loginUrl);
    clearAuthCookies(response);
    return response;
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const role = typeof token.role === "string" ? token.role.toUpperCase() : "";
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
