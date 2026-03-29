export type OrganizationRole = "admin" | "operator" | "approver" | "viewer";
export type PlatformRole = "super_admin" | null;

export type OrganizationMembership = {
  organizationId: string;
  organizationName: string;
  brandIds: string[];
  role: OrganizationRole;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  platformRole: PlatformRole;
  organizationMemberships: OrganizationMembership[];
  selectedOrganizationId: string | null;
  selectedBrandId: string | null;
};
