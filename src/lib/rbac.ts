export type Role =
  | "Super Admin"
  | "Administrator"
  | "Content Manager"
  | "Research Manager"
  | "Event Manager"
  | "Editor"
  | "Reviewer"
  | "Analyst";

export type Permission =
  | "View"
  | "Create"
  | "Edit"
  | "Delete"
  | "Approve"
  | "Publish"
  | "Export"
  | "Manage";

export const RBAC_MATRIX: Record<Role, Record<Permission, boolean>> = {
  "Super Admin": { View: true, Create: true, Edit: true, Delete: true, Approve: true, Publish: true, Export: true, Manage: true },
  Administrator: { View: true, Create: true, Edit: true, Delete: true, Approve: true, Publish: true, Export: true, Manage: false },
  "Content Manager": { View: true, Create: true, Edit: true, Delete: false, Approve: true, Publish: true, Export: true, Manage: false },
  "Research Manager": { View: true, Create: true, Edit: true, Delete: false, Approve: true, Publish: false, Export: true, Manage: false },
  "Event Manager": { View: true, Create: true, Edit: true, Delete: false, Approve: false, Publish: true, Export: true, Manage: false },
  Editor: { View: true, Create: true, Edit: true, Delete: false, Approve: false, Publish: false, Export: false, Manage: false },
  Reviewer: { View: true, Create: false, Edit: false, Delete: false, Approve: true, Publish: false, Export: true, Manage: false },
  Analyst: { View: true, Create: false, Edit: false, Delete: false, Approve: false, Publish: false, Export: true, Manage: false },
};

/**
 * Server-side authorization check
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return !!RBAC_MATRIX[role]?.[permission];
}

/**
 * Verifies that a user has permission to transition approval statuses
 */
export function canTransitionApproval(role: Role, targetStatus: "Approved" | "Published" | "Rejected"): boolean {
  if (targetStatus === "Approved" || targetStatus === "Rejected") {
    return hasPermission(role, "Approve");
  }
  if (targetStatus === "Published") {
    return hasPermission(role, "Publish");
  }
  return false;
}
