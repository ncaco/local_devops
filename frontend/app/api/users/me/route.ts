import { NextResponse } from "next/server";
import { getValidatedSession } from "@/src/shared/auth/getValidatedSession";

const backendApiUrl = process.env.BACKEND_API_URL;

export async function GET() {
  if (!backendApiUrl) {
    return NextResponse.json({ detail: "BACKEND_API_URL is not set" }, { status: 500 });
  }

  const session = await getValidatedSession();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(`${backendApiUrl}/api/v1/auth/session-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });

  const data = await response.json().catch(() => ({ detail: "Failed to fetch user profile" }));
  return NextResponse.json(data, { status: response.status });
}

export async function PATCH(request: Request) {
  if (!backendApiUrl) {
    return NextResponse.json({ detail: "BACKEND_API_URL is not set" }, { status: 500 });
  }

  const session = await getValidatedSession();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { name?: string | null };
  const response = await fetch(`${backendApiUrl}/api/v1/auth/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      name: body.name,
    }),
  });

  const data = await response.json().catch(() => ({ detail: "Failed to update user profile" }));
  return NextResponse.json(data, { status: response.status });
}
