import { NextResponse } from "next/server";
import { getValidatedSession } from "@/src/shared/auth/getValidatedSession";

const backendApiUrl = process.env.BACKEND_API_URL;
const minuteWindowMs = 60 * 1000;
const lockoutWindowMs = 15 * 60 * 1000;
const maxRequestsPerMinute = 5;
const maxFailedAttempts = 5;

type AttemptState = {
  requestTimestamps: number[];
  failedAttempts: number;
  lockUntil: number;
};

const attemptStore = new Map<string, AttemptState>();

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const [firstIp] = forwardedFor.split(",");
    if (firstIp?.trim()) return firstIp.trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp?.trim()) return realIp.trim();
  return "unknown";
}

function getAttemptState(key: string): AttemptState {
  const now = Date.now();
  const existing = attemptStore.get(key);
  if (!existing) {
    const created: AttemptState = { requestTimestamps: [now], failedAttempts: 0, lockUntil: 0 };
    attemptStore.set(key, created);
    return created;
  }

  existing.requestTimestamps = existing.requestTimestamps.filter((timestamp) => now - timestamp < minuteWindowMs);
  existing.requestTimestamps.push(now);

  if (existing.lockUntil > 0 && now >= existing.lockUntil) {
    existing.lockUntil = 0;
    existing.failedAttempts = 0;
  }

  return existing;
}

function isStrongPassword(password: string): boolean {
  if (password.length < 10) return false;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const categoryCount = [hasLetter, hasDigit, hasSpecial].filter(Boolean).length;
  return categoryCount >= 2;
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

  const attemptKey = `${userId}:${getClientIp(request)}`;
  const attemptState = getAttemptState(attemptKey);
  const now = Date.now();

  if (attemptState.lockUntil > now) {
    return NextResponse.json({ detail: "요청이 너무 많아 잠시 차단되었습니다. 15분 뒤 다시 시도해주세요." }, { status: 429 });
  }

  if (attemptState.requestTimestamps.length > maxRequestsPerMinute) {
    return NextResponse.json({ detail: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." }, { status: 429 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    current_password?: string;
    new_password?: string;
  };
  const currentPassword = (body.current_password ?? "").trim();
  const newPassword = (body.new_password ?? "").trim();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ detail: "현재 비밀번호와 새 비밀번호를 입력하세요." }, { status: 400 });
  }

  if (currentPassword === newPassword) {
    return NextResponse.json({ detail: "현재 비밀번호와 다른 새 비밀번호를 입력하세요." }, { status: 400 });
  }

  if (!isStrongPassword(newPassword)) {
    return NextResponse.json({ detail: "새 비밀번호는 10자 이상이며 문자/숫자/특수문자 중 2종 이상을 포함해야 합니다." }, { status: 400 });
  }

  const response = await fetch(`${backendApiUrl}/api/v1/auth/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });

  if (!response.ok) {
    attemptState.failedAttempts += 1;
    if (attemptState.failedAttempts >= maxFailedAttempts) {
      attemptState.lockUntil = now + lockoutWindowMs;
    }
  } else {
    attemptState.failedAttempts = 0;
    attemptState.lockUntil = 0;
  }

  const data = await response.json().catch(() => ({ detail: "Failed to change password" }));
  return NextResponse.json(data, { status: response.status });
}
