import { ROLES } from "@/constants/auth";
import { STATUS } from "@/constants/status";

import type { RoleType, UserType } from "@/types/auth";

export function canRequestChanges(
  status: string,
  userLineId: string | number,
  currentLineId: string | number,
  userRole?: RoleType
): boolean {
  const editableStatuses = [STATUS.DEFECT, STATUS.RECHECK, STATUS.REJECTED];
  const allowedRoles: RoleType[] = [ROLES.OPERATOR];

  const isEditable = editableStatuses.includes(status);
  const isSameLine = String(userLineId) === String(currentLineId);
  const isRoleAllowed = userRole ? allowedRoles.includes(userRole) : true;

  return isEditable && isSameLine && isRoleAllowed;
}

export function isHiddenRepairImages(statusCode: string | undefined) {
  return ![STATUS.NORMAL, STATUS.SCRAP].includes(String(statusCode));
}

export function shouldShowUpdateStatusButton(
  statusCode?: string,
  user?: UserType
): boolean {
  if (!user) return false;

  const allowedStatuses = [STATUS.DEFECT, STATUS.NORMAL, STATUS.SCRAP];
  const disallowedRoles: RoleType[] = [ROLES.VIEWER, ROLES.INSPECTOR];

  return (
    allowedStatuses.includes(String(statusCode)) &&
    !disallowedRoles.includes(user.role)
  );
}
