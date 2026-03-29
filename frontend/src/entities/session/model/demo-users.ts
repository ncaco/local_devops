import { SessionUser } from "./types";

const defaultOrganization = {
  organizationId: "org_001",
  organizationName: "NC97 Marketing HQ",
  brandIds: ["brand_a", "brand_b", "brand_c"],
};

const platformOrg = {
  organizationId: "org_platform",
  organizationName: "NC97 Platform Ops",
  brandIds: ["platform"],
};

export const demoUsers: Record<string, SessionUser> = {
  "admin@example.com": {
    id: "usr_admin",
    name: "홍길동",
    email: "admin@example.com",
    platformRole: null,
    organizationMemberships: [{ ...defaultOrganization, role: "admin" }],
    selectedOrganizationId: defaultOrganization.organizationId,
    selectedBrandId: "brand_a",
  },
  "operator@example.com": {
    id: "usr_operator",
    name: "김도윤",
    email: "operator@example.com",
    platformRole: null,
    organizationMemberships: [{ ...defaultOrganization, role: "operator" }],
    selectedOrganizationId: defaultOrganization.organizationId,
    selectedBrandId: "brand_a",
  },
  "approver@example.com": {
    id: "usr_approver",
    name: "이서연",
    email: "approver@example.com",
    platformRole: null,
    organizationMemberships: [{ ...defaultOrganization, role: "approver" }],
    selectedOrganizationId: defaultOrganization.organizationId,
    selectedBrandId: "brand_b",
  },
  "viewer@example.com": {
    id: "usr_viewer",
    name: "정하늘",
    email: "viewer@example.com",
    platformRole: null,
    organizationMemberships: [{ ...defaultOrganization, role: "viewer" }],
    selectedOrganizationId: defaultOrganization.organizationId,
    selectedBrandId: "brand_c",
  },
  "superadmin@example.com": {
    id: "usr_super_admin",
    name: "박지수",
    email: "superadmin@example.com",
    platformRole: "super_admin",
    organizationMemberships: [{ ...platformOrg, role: "admin" }],
    selectedOrganizationId: platformOrg.organizationId,
    selectedBrandId: "platform",
  },
};
