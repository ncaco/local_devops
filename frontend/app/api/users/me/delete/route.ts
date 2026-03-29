import { NextResponse } from "next/server";
import { getValidatedSession } from "@/src/shared/auth/getValidatedSession";

const backendApiUrl = process.env.BACKEND_API_URL;

export async function POST(request: Request) {
  if (!backendApiUrl) {
    return NextResponse.json({ detail: "BACKEND_API_URL is not set" }, { status: 500 });
  }

  const session = await getValidatedSession();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    current_password?: string;
    confirmation_email?: string;
  };

  const response = await fetch(`${backendApiUrl}/api/v1/auth/delete-account`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      current_password: body.current_password,
      confirmation_email: body.confirmation_email,
    }),
  });

  const data = await response.json().catch(() => ({ detail: "Failed to delete account" }));
  return NextResponse.json(data, { status: response.status });
}
