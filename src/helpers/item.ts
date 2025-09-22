import { isEmpty } from "radash";

import { REVIEW_STATE_OPTION } from "@/contants/review";

import type { LineResponse } from "@/hooks/line/use-line";
import type { OptionT } from "@/types/option";
import type { ReviewT } from "@/types/station";

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
