import { NextResponse } from "next/server";
import { getValidatedSession } from "@/src/shared/auth/getValidatedSession";

const backendApiUrl = process.env.BACKEND_API_URL;

export async function PATCH(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  if (!backendApiUrl) {
    return NextResponse.json({ detail: "BACKEND_API_URL is not set" }, { status: 500 });
  }

  const session = await getValidatedSession();
  const userId = session?.user?.id;
  const userRole = session?.user?.role?.toUpperCase();
  if (!userId) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }
  if (userRole !== "ADMIN") {
    return NextResponse.json({ detail: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as { new_password?: string; actor_current_password?: string };
  const { userId: targetUserId } = await params;
  const response = await fetch(`${backendApiUrl}/api/v1/admin/users/${targetUserId}/password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      actor_user_id: userId,
      actor_current_password: body.actor_current_password,
      new_password: body.new_password,
    }),
  });

  const data = await response.json().catch(() => ({ detail: "Failed to update user password" }));
  return NextResponse.json(data, { status: response.status });
}
