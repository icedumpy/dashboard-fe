import { isEmpty } from "radash";

import { ROLES } from "@/shared/constants/auth";
import { REVIEW_STATE_OPTION } from "@/shared/constants/review";
import { STATUS } from "@/shared/constants/status";

import type { LineResponse } from "@/shared/hooks/line/use-line";
import type { Role, User } from "@/shared/types/auth";
import type { OptionT } from "@/shared/types/option";
import type { ReviewT, StationDetailResponse } from "@/shared/types/item";

export const getLineCode = (
  lineId?: number,
  lineData?: LineResponse["data"]
) => {
  return (
    lineData?.find((item) => Number(item.id) === Number(lineId))?.code ?? "-"
  );
};

export const getDefectNames = (
  defects?: { defect_type_code: string }[],
  defectOptions?: OptionT[]
) => {
  if (isEmpty(defects) || isEmpty(defectOptions)) return "-";
  return defects
    ?.map(
      (defect) =>
        defectOptions?.find(
          (item) => item?.meta?.code === defect.defect_type_code
        )?.label ?? "-"
    )
    .join(", ");
};

export const getCurrentState = (reviews?: ReviewT[]) => {
  if (isEmpty(reviews)) return "-";
  const sorted =
    reviews
      ?.sort(
        (a, b) =>
          new Date(a.submitted_at).getTime() -
          new Date(b.submitted_at).getTime()
      )
      .map((review) => review.state) ?? [];

  const latestState = sorted[sorted.length - 1];
  const mappedLabel = REVIEW_STATE_OPTION.find(
    (option) => option.value === latestState
  )?.label;

  return mappedLabel ?? "-";
};

export function canRequestChanges(
  status?: string,
  userLineId?: string | number,
  currentLineId?: string | number,
  userRole?: Role
): boolean {
  if (!status || !userLineId || !currentLineId) return false;
  const editableStatuses = [STATUS.DEFECT, STATUS.RECHECK, STATUS.REJECTED];
  const allowedRoles: Role[] = [ROLES.OPERATOR];

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
  user?: User
): boolean {
  if (!user) return false;

  const allowedStatuses = [STATUS.DEFECT, STATUS.NORMAL, STATUS.SCRAP];
  const disallowedRoles: Role[] = [ROLES.VIEWER, ROLES.INSPECTOR];

  return (
    allowedStatuses.includes(String(statusCode)) &&
    disallowedRoles.includes(user.role)
  );
}

export function canEditItemDetail(role?: Role) {
  const allowedRoles: Role[] = [ROLES.INSPECTOR, ROLES.OPERATOR];
  return !!role && allowedRoles.includes(role);
}

export function canUpdatePrinter(
  defects?: StationDetailResponse["defects"],
  role?: Role
): boolean {
  if (!role || !defects) return false;

  const allowedRoles: Role[] = [ROLES.OPERATOR, ROLES.INSPECTOR];
  const hasScratchDefect = defects?.some(
    (defect) => defect.defect_type_code === "SCRATCH"
  );
  return allowedRoles.includes(role) && !!hasScratchDefect;
}
