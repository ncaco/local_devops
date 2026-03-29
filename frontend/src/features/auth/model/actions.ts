"use server";

import { redirect } from "next/navigation";

import {
  clearSessionUser,
  createSessionFromEmail,
  setSessionUser,
} from "@/entities/session/lib/server-session";

function requiredText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function loginAction(formData: FormData) {
  const email = requiredText(formData.get("email"));
  const password = requiredText(formData.get("password"));
  const next = requiredText(formData.get("next")) || "/overview";

  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent("이메일과 비밀번호를 입력하세요.")}`);
  }

  const user = createSessionFromEmail(email);
  await setSessionUser(user);
  redirect(user.platformRole === "super_admin" && next === "/overview" ? "/super-admin" : next);
}

export async function signupAction(formData: FormData) {
  const name = requiredText(formData.get("name"));
  const email = requiredText(formData.get("email"));
  const password = requiredText(formData.get("password"));
  const organizationName = requiredText(formData.get("organizationName"));

  if (!name || !email || !password) {
    redirect(`/signup?error=${encodeURIComponent("필수 항목을 모두 입력하세요.")}`);
  }

  const user = createSessionFromEmail(email, { organizationName });
  await setSessionUser({ ...user, name });
  redirect("/my?welcome=signup");
}

export async function acceptInviteAction(formData: FormData) {
  const name = requiredText(formData.get("name"));
  const email = requiredText(formData.get("email"));
  const password = requiredText(formData.get("password"));
  const inviteToken = requiredText(formData.get("inviteToken"));

  if (!name || !email || !password || !inviteToken) {
    redirect(`/signup?error=${encodeURIComponent("초대 수락 정보가 누락되었습니다.")}`);
  }

  const user = createSessionFromEmail(email, { inviteToken });
  await setSessionUser({ ...user, name });
  redirect("/my?welcome=invite");
}

export async function logoutAction() {
  await clearSessionUser();
  redirect("/");
}
