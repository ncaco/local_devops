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

  const response = await fetch(`${backendApiUrl}/api/v1/auth/profile-avatar?user_id=${encodeURIComponent(userId)}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({ detail: "Failed to fetch avatar" }));
    return NextResponse.json(data, { status: response.status });
  }

  const contentType = response.headers.get("content-type") ?? "application/octet-stream";
  const buffer = await response.arrayBuffer();
  return new Response(buffer, {
    status: response.status,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, no-store",
    },
  });
}

export async function POST(request: Request) {
  if (!backendApiUrl) {
    return NextResponse.json({ detail: "BACKEND_API_URL is not set" }, { status: 500 });
  }

  const session = await getValidatedSession();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ detail: "Avatar file is required." }, { status: 400 });
  }

  const backendFormData = new FormData();
  backendFormData.append("user_id", userId);
  backendFormData.append("file", file);

  const response = await fetch(`${backendApiUrl}/api/v1/auth/profile-avatar`, {
    method: "POST",
    body: backendFormData,
  });

  const data = await response.json().catch(() => ({ detail: "Failed to upload avatar" }));
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE() {
  if (!backendApiUrl) {
    return NextResponse.json({ detail: "BACKEND_API_URL is not set" }, { status: 500 });
  }

  const session = await getValidatedSession();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(`${backendApiUrl}/api/v1/auth/profile-avatar`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });

  const data = await response.json().catch(() => ({ detail: "Failed to delete avatar" }));
  return NextResponse.json(data, { status: response.status });
}
