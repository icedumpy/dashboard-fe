import { ROLES } from "@/contants/auth";
import { STATUS } from "@/contants/status";

import type { UserType } from "@/types/auth";

export function canRequestChanges(
  status: string,
  userLineId: string | number,
  currentLineId: string | number,
  isPendingReview: boolean
) {
  const isEditable = [STATUS.DEFECT, STATUS.RECHECK, STATUS.REJECTED].includes(
    status
  );
  const isCrossLine = String(userLineId) !== String(currentLineId);
  return isEditable && !isCrossLine && !isPendingReview;
}

export function isHiddenRepairImages(statusCode: string | undefined) {
  return ![STATUS.NORMAL, STATUS.SCRAP].includes(String(statusCode));
}

export function shouldShowUpdateStatusButton(
  statusCode: string | undefined,
  user?: UserType
) {
  return (
    [STATUS.DEFECT, STATUS.NORMAL, STATUS.SCRAP].includes(String(statusCode)) &&
    user?.role != ROLES.VIEWER
  );
}
