import type { AdminUserRoleFilter, AdminUserSearchField } from "./admin-users";

type AdminWithdrawnUserListResponse = {
  items: AdminWithdrawnUser[];
  page: number;
  size: number;
  total: number;
  total_all: number;
  total_admin: number;
  total_user: number;
};

export type AdminWithdrawnUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  organization_count: number;
  project_count: number;
  avatar_updated_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
};

type ApiErrorResponse = {
  detail?: unknown;
};

function normalizeApiError(detail: unknown, fallback: string): string {
  if (typeof detail === "string" && detail.trim().length > 0) {
    return detail;
  }
  return fallback;
}

export async function fetchAdminWithdrawnUsers(params: {
  page: number;
  size: number;
  search?: string;
  searchField?: AdminUserSearchField;
  role?: AdminUserRoleFilter;
}): Promise<{ ok: true; data: AdminWithdrawnUserListResponse } | { ok: false; error: string }> {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    size: String(params.size),
  });
  const normalizedSearch = params.search?.trim();
  if (normalizedSearch) searchParams.set("search", normalizedSearch);
  if (params.searchField) searchParams.set("search_field", params.searchField);
  if (params.role && params.role !== "ALL") searchParams.set("role", params.role);

  const response = await fetch(`/api/admin/withdrawn-users?${searchParams.toString()}`, { method: "GET" });
  const data = (await response.json().catch(() => ({}))) as AdminWithdrawnUserListResponse & ApiErrorResponse;
  if (!response.ok) {
    return { ok: false, error: normalizeApiError(data.detail, "탈퇴회원 목록을 불러오지 못했습니다.") };
  }

  return {
    ok: true,
    data: {
      items: data.items ?? [],
      page: data.page ?? params.page,
      size: data.size ?? params.size,
      total: data.total ?? 0,
      total_all: data.total_all ?? 0,
      total_admin: data.total_admin ?? 0,
      total_user: data.total_user ?? 0,
    },
  };
}

export async function hardDeleteAdminWithdrawnUser(payload: {
  targetUserId: string;
  confirmationEmail: string;
}): Promise<{ ok: true; message: string } | { ok: false; error: string }> {
  const response = await fetch(`/api/admin/withdrawn-users/${payload.targetUserId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      confirmation_email: payload.confirmationEmail,
    }),
  });
  const data = (await response.json().catch(() => ({}))) as { message?: string } & ApiErrorResponse;

  if (!response.ok) {
    return { ok: false, error: normalizeApiError(data.detail, "탈퇴회원 삭제에 실패했습니다.") };
  }

  return { ok: true, message: data.message ?? "탈퇴회원 삭제를 완료했습니다." };
}
