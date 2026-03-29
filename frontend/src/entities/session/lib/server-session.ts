import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { demoUsers } from "../model/demo-users";
import { OrganizationMembership, OrganizationRole, SessionUser } from "../model/types";

const SESSION_COOKIE = "sns_console_session";

function encodeSession(user: SessionUser) {
  return Buffer.from(JSON.stringify(user)).toString("base64url");
}

function decodeSession(rawValue: string | undefined): SessionUser | null {
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(rawValue, "base64url").toString("utf8")) as SessionUser;
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function setSessionUser(user: SessionUser) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, encodeSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearSessionUser() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function createSessionFromEmail(
  email: string,
  options?: { inviteToken?: string; organizationName?: string },
) {
  const normalized = email.trim().toLowerCase();
  const existing = demoUsers[normalized];

  if (existing) {
    return existing;
  }

  const membership: OrganizationMembership = options?.inviteToken
    ? {
        organizationId: "org_001",
        organizationName: "NC97 Marketing HQ",
        brandIds: ["brand_a", "brand_b"],
        role: "approver",
      }
    : {
        organizationId: "org_new",
        organizationName: options?.organizationName?.trim() || "New Organization",
        brandIds: ["brand_primary"],
        role: "admin",
      };

  return {
    id: `usr_${normalized.replace(/[^a-z0-9]/g, "").slice(0, 12) || "new"}`,
    name: normalized.split("@")[0] || "신규 사용자",
    email: normalized,
    platformRole: normalized.includes("super") ? "super_admin" : null,
    organizationMemberships: [membership],
    selectedOrganizationId: membership.organizationId,
    selectedBrandId: membership.brandIds[0] ?? null,
  } satisfies SessionUser;
}

export function getPrimaryMembership(user: SessionUser | null) {
  if (!user) {
    return null;
  }

  return (
    user.organizationMemberships.find(
      (membership) => membership.organizationId === user.selectedOrganizationId,
    ) ?? user.organizationMemberships[0] ?? null
  );
}

export function hasOrganizationRole(user: SessionUser | null, allowedRoles: OrganizationRole[]) {
  const membership = getPrimaryMembership(user);
  return membership ? allowedRoles.includes(membership.role) : false;
}

export async function requireAuthenticatedUser(next?: string) {
  const user = await getSessionUser();

  if (!user) {
    redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  }

  return user;
}

export async function requireOrganizationAdmin(next?: string) {
  const user = await requireAuthenticatedUser(next);

  if (!hasOrganizationRole(user, ["admin"])) {
    redirect("/overview");
  }

  return user;
}

export async function requirePlatformAdmin(next?: string) {
  const user = await requireAuthenticatedUser(next);

  if (user.platformRole !== "super_admin") {
    redirect("/overview");
  }

  return user;
}
