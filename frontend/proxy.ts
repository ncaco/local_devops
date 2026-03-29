import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "sns_console_session";

type MiddlewareUser = {
  platformRole: "super_admin" | null;
  organizationMemberships: Array<{
    role: "admin" | "operator" | "approver" | "viewer";
  }>;
};

function decodeSession(rawValue: string | undefined): MiddlewareUser | null {
  if (!rawValue) {
    return null;
  }

  try {
    const normalized = rawValue.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalized)) as MiddlewareUser;
  } catch {
    return null;
  }
}

function hasOrgAdmin(user: MiddlewareUser | null) {
  return user?.organizationMemberships.some((membership) => membership.role === "admin");
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = decodeSession(request.cookies.get(SESSION_COOKIE)?.value);
  const isAuthPage =
    pathname === "/login" || pathname === "/signup" || pathname.startsWith("/invite/");
  const isProtectedPath =
    pathname === "/my" ||
    pathname === "/overview" ||
    pathname === "/approvals" ||
    pathname === "/failures" ||
    pathname === "/composer" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/super-admin");

  if (!session && isProtectedPath) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  if (session && isAuthPage) {
    const url = new URL(session.platformRole === "super_admin" ? "/super-admin" : "/overview", request.url);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") && !hasOrgAdmin(session)) {
    return NextResponse.redirect(new URL("/overview", request.url));
  }

  if (pathname.startsWith("/super-admin") && session?.platformRole !== "super_admin") {
    return NextResponse.redirect(new URL("/overview", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/invite/:path*",
    "/my",
    "/overview",
    "/approvals",
    "/failures",
    "/composer",
    "/admin/:path*",
    "/super-admin/:path*",
  ],
};
