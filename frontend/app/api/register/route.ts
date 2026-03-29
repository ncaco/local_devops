import { NextResponse } from "next/server";

const backendApiUrl = process.env.BACKEND_API_URL;

export async function POST(request: Request) {
  if (!backendApiUrl) {
    return NextResponse.json({ detail: "BACKEND_API_URL is not set" }, { status: 500 });
  }

  const body = await request.json();
  const response = await fetch(`${backendApiUrl}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({ detail: "Registration failed" }));
  return NextResponse.json(data, { status: response.status });
}
