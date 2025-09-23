import { ROLES } from "@/constants/auth";
import { STATUS } from "@/constants/status";

import type { RoleType, UserType } from "@/types/auth";

export function canRequestChanges(
  status: string,
  userLineId: string | number,
  currentLineId: string | number,
  isPendingReview: boolean,
  userRole?: RoleType
): boolean {
  const editableStatuses = [STATUS.DEFECT, STATUS.RECHECK, STATUS.REJECTED];
  const disallowedRoles: RoleType[] = [ROLES.VIEWER, ROLES.INSPECTOR];

  const isEditable = editableStatuses.includes(status);
  const isSameLine = String(userLineId) === String(currentLineId);
  const isRoleAllowed = userRole ? !disallowedRoles.includes(userRole) : true;

  return isEditable && isSameLine && !isPendingReview && !isRoleAllowed;
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
