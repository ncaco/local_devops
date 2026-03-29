import type { UserRole } from "@/src/entities/user/model/types";

export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  organization_count: number;
  project_count: number;
  avatar_updated_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type AdminUserListResponse = {
  items: AdminUser[];
  page: number;
  size: number;
  total: number;
  total_all: number;
  total_admin: number;
  total_user: number;
};

type ApiErrorResponse = {
  detail?: unknown;
};

export type AdminUserRoleFilter = "ALL" | UserRole;
export type AdminUserSearchField = "name" | "email";

function normalizeApiError(detail: unknown, fallback: string): string {
  if (typeof detail === "string" && detail.trim().length > 0) {
    return detail;
  }
  return fallback;
}

export async function fetchAdminUsers(params: {
  page: number;
  size: number;
  search?: string;
  searchField?: AdminUserSearchField;
  role?: AdminUserRoleFilter;
}): Promise<{ ok: true; data: AdminUserListResponse } | { ok: false; error: string }> {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    size: String(params.size),
  });
  const normalizedSearch = params.search?.trim();
  if (normalizedSearch) {
    searchParams.set("search", normalizedSearch);
  }
  if (params.searchField) {
    searchParams.set("search_field", params.searchField);
  }
  if (params.role && params.role !== "ALL") {
    searchParams.set("role", params.role);
  }

  const response = await fetch(`/api/admin/users?${searchParams.toString()}`, { method: "GET" });
  const data = (await response.json().catch(() => ({}))) as AdminUserListResponse & ApiErrorResponse;

  if (!response.ok) {
    return { ok: false, error: normalizeApiError(data.detail, "사용자 목록을 불러오지 못했습니다.") };
  }

  return {
    ok: true,
    data: {
      items: (data.items ?? []).map((item) => ({
        ...item,
        organization_count: item.organization_count ?? 0,
        project_count: item.project_count ?? 0,
      })),
      page: data.page ?? params.page,
      size: data.size ?? params.size,
      total: data.total ?? 0,
      total_all: data.total_all ?? 0,
      total_admin: data.total_admin ?? 0,
      total_user: data.total_user ?? 0,
    },
  };
}

export async function updateAdminUserRole(payload: {
  userId: string;
  role: UserRole;
}): Promise<{ ok: true; user: AdminUser } | { ok: false; error: string }> {
  const response = await fetch(`/api/admin/users/${payload.userId}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: payload.role }),
  });
  const data = (await response.json().catch(() => ({}))) as AdminUser & ApiErrorResponse;

  if (!response.ok) {
    return { ok: false, error: normalizeApiError(data.detail, "사용자 역할 변경에 실패했습니다.") };
  }

  return { ok: true, user: data };
}

export async function updateAdminUserPassword(payload: {
  userId: string;
  adminCurrentPassword: string;
  newPassword: string;
}): Promise<{ ok: true; message: string } | { ok: false; error: string }> {
  const response = await fetch(`/api/admin/users/${payload.userId}/password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      actor_current_password: payload.adminCurrentPassword,
      new_password: payload.newPassword,
    }),
  });
  const data = (await response.json().catch(() => ({}))) as { message?: string } & ApiErrorResponse;

  if (!response.ok) {
    return { ok: false, error: normalizeApiError(data.detail, "사용자 비밀번호 변경에 실패했습니다.") };
  }

  return { ok: true, message: data.message ?? "사용자 비밀번호가 변경되었습니다." };
}
