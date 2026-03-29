export type CurrentUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  avatar_updated_at?: string | null;
  image?: string | null;
  created_at?: string;
  updated_at?: string;
};

type ApiErrorResponse = {
  detail?: unknown;
  message?: string;
};

function normalizeApiError(detail: unknown, fallback: string): string {
  if (typeof detail === "string" && detail.trim().length > 0) {
    return detail;
  }
  return fallback;
}

function toAvatarUrl(avatarUpdatedAt?: string | null): string | null {
  if (!avatarUpdatedAt) return null;
  return `/api/users/me/avatar?v=${encodeURIComponent(avatarUpdatedAt)}`;
}

function withAvatarImage(user: CurrentUser): CurrentUser {
  return {
    ...user,
    image: toAvatarUrl(user.avatar_updated_at),
  };
}

export async function fetchCurrentUser(): Promise<{ ok: true; user: CurrentUser } | { ok: false; error: string }> {
  const response = await fetch("/api/users/me", { method: "GET" });
  const data = (await response.json().catch(() => ({}))) as CurrentUser & ApiErrorResponse;

  if (!response.ok) {
    return { ok: false, error: normalizeApiError(data.detail, "사용자 정보를 불러오지 못했습니다.") };
  }

  return { ok: true, user: withAvatarImage(data) };
}

export async function updateCurrentUserProfile(payload: {
  name: string | null;
}): Promise<{ ok: true; user: CurrentUser } | { ok: false; error: string }> {
  const response = await fetch("/api/users/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json().catch(() => ({}))) as CurrentUser & ApiErrorResponse;

  if (!response.ok) {
    return { ok: false, error: normalizeApiError(data.detail, "프로필 수정에 실패했습니다.") };
  }

  return { ok: true, user: withAvatarImage(data) };
}

export async function uploadCurrentUserAvatar(file: File): Promise<{ ok: true; user: CurrentUser } | { ok: false; error: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/users/me/avatar", {
    method: "POST",
    body: formData,
  });
  const data = (await response.json().catch(() => ({}))) as CurrentUser & ApiErrorResponse;

  if (!response.ok) {
    return { ok: false, error: normalizeApiError(data.detail, "프로필 썸네일 업로드에 실패했습니다.") };
  }

  return { ok: true, user: withAvatarImage(data) };
}

export async function deleteCurrentUserAvatar(): Promise<{ ok: true; user: CurrentUser } | { ok: false; error: string }> {
  const response = await fetch("/api/users/me/avatar", {
    method: "DELETE",
  });
  const data = (await response.json().catch(() => ({}))) as CurrentUser & ApiErrorResponse;

  if (!response.ok) {
    return { ok: false, error: normalizeApiError(data.detail, "프로필 썸네일 삭제에 실패했습니다.") };
  }

  return { ok: true, user: withAvatarImage(data) };
}

export async function changeCurrentUserPassword(payload: {
  current_password: string;
  new_password: string;
}): Promise<{ ok: true; message: string } | { ok: false; error: string }> {
  const response = await fetch("/api/users/me/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json().catch(() => ({}))) as ApiErrorResponse;

  if (!response.ok) {
    return { ok: false, error: normalizeApiError(data.detail, "비밀번호 변경에 실패했습니다.") };
  }

  return { ok: true, message: typeof data.message === "string" ? data.message : "비밀번호가 변경되었습니다." };
}

export async function deleteCurrentUserAccount(payload: {
  current_password: string;
  confirmation_email: string;
}): Promise<{ ok: true; message: string } | { ok: false; error: string }> {
  const response = await fetch("/api/users/me/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json().catch(() => ({}))) as ApiErrorResponse;

  if (!response.ok) {
    return { ok: false, error: normalizeApiError(data.detail, "탈퇴 신청에 실패했습니다.") };
  }

  return { ok: true, message: typeof data.message === "string" ? data.message : "탈퇴 신청이 완료되었습니다." };
}
