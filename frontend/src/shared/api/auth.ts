type RegisterPayload = {
  email: string;
  password: string;
  name: string | null;
};

type RegisterResult = {
  ok: boolean;
  error?: string;
};

type ForgotPasswordPayload = {
  email: string;
};

type ForgotPasswordResult = {
  ok: boolean;
  message?: string;
  resetCode?: string;
  error?: string;
};

type VerifyResetCodePayload = {
  email: string;
  code: string;
};

type VerifyResetCodeResult = {
  ok: boolean;
  message?: string;
  resetToken?: string;
  error?: string;
};

type ResetPasswordPayload = {
  token: string;
  password: string;
};

type ResetPasswordResult = {
  ok: boolean;
  message?: string;
  error?: string;
};

function normalizeApiError(detail: unknown, fallback: string): string {
  if (typeof detail === "string" && detail.trim().length > 0) {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0] as { msg?: unknown } | undefined;
    if (first && typeof first.msg === "string" && first.msg.trim().length > 0) {
      return first.msg;
    }
  }

  if (detail && typeof detail === "object") {
    const maybeMsg = (detail as { msg?: unknown }).msg;
    if (typeof maybeMsg === "string" && maybeMsg.trim().length > 0) {
      return maybeMsg;
    }
  }

  return fallback;
}

export async function registerUser(payload: RegisterPayload): Promise<RegisterResult> {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { detail?: unknown };
    return { ok: false, error: normalizeApiError(data.detail, "회원가입에 실패했습니다.") };
  }

  return { ok: true };
}

export async function requestPasswordReset(payload: ForgotPasswordPayload): Promise<ForgotPasswordResult> {
  const response = await fetch("/api/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as {
    detail?: unknown;
    message?: string;
    reset_code?: string;
  };

  if (!response.ok) {
    return { ok: false, error: normalizeApiError(data.detail, "비밀번호 재설정 요청에 실패했습니다.") };
  }

  return { ok: true, message: data.message, resetCode: data.reset_code };
}

export async function verifyPasswordResetCode(payload: VerifyResetCodePayload): Promise<VerifyResetCodeResult> {
  const response = await fetch("/api/verify-reset-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as {
    detail?: unknown;
    message?: string;
    reset_token?: string;
  };

  if (!response.ok) {
    return { ok: false, error: normalizeApiError(data.detail, "인증 코드 확인에 실패했습니다.") };
  }

  return { ok: true, message: data.message, resetToken: data.reset_token };
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<ResetPasswordResult> {
  const response = await fetch("/api/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as {
    detail?: unknown;
    message?: string;
  };

  if (!response.ok) {
    return { ok: false, error: normalizeApiError(data.detail, "비밀번호 변경에 실패했습니다.") };
  }

  return { ok: true, message: data.message };
}
