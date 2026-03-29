import { NextResponse } from "next/server";
import { getValidatedSession } from "@/src/shared/auth/getValidatedSession";

const backendApiUrl = process.env.BACKEND_API_URL;

export async function GET(request: Request) {
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

  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "1";
  const size = searchParams.get("size") ?? "20";
  const search = searchParams.get("search")?.trim() ?? "";
  const searchField = searchParams.get("search_field")?.trim().toUpperCase() ?? "";
  const role = searchParams.get("role")?.trim().toUpperCase() ?? "";

  const backendQuery = new URLSearchParams({
    actor_user_id: userId,
    page,
    size,
  });
  if (search) backendQuery.set("search", search);
  if (searchField === "NAME" || searchField === "EMAIL") backendQuery.set("search_field", searchField);
  if (role === "USER" || role === "ADMIN") backendQuery.set("role", role);

  const response = await fetch(`${backendApiUrl}/api/v1/admin/withdrawn-users?${backendQuery.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({ detail: "Failed to fetch withdrawn users" }));
  return NextResponse.json(data, { status: response.status });
}
