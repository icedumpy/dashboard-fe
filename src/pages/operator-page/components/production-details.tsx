import dayjs from "dayjs";
import { useMemo } from "react";
import { isEmpty } from "radash";

import { useLineAPI } from "@/hooks/line/use-line";
import { DATE_TIME_FORMAT } from "@/contants/format";
import { useDefectOptionAPI } from "@/hooks/option/use-defect-option";
import { REVIEW_STATE_OPTION } from "@/contants/review";

import type { StationDetailResponse } from "@/types/station";

interface ProductDetailProps {
  data?: StationDetailResponse["data"];
  defects?: StationDetailResponse["defects"];
  reviews?: StationDetailResponse["reviews"];
}

export default function ProductDetail({
  data,
  defects,
  reviews,
}: ProductDetailProps) {
  const { data: line } = useLineAPI();
  const { data: defectOptions } = useDefectOptionAPI();

  const lineCode = useMemo(() => {
    return (
      line?.data?.find((item) => Number(item.id) === Number(data?.line_id))
        ?.code ?? "-"
    );
  }, [line, data?.line_id]);

  const defectNames = useMemo(() => {
    if (!defects || !defectOptions) return "-";
    return defects
      .map(
        (defect) =>
          defectOptions.find(
            (item) => item?.meta?.code === defect.defect_type_code
          )?.label ?? "-"
      )
      .join(", ");
  }, [defects, defectOptions]);

  const currentState = useMemo(() => {
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
  }, [reviews]);

  const details = useMemo(
    () => [
      { label: "Production Line:", value: lineCode },
      { label: "Job Order Number:", value: data?.job_order_number ?? "-" },
      { label: "ประเภท Defect:", value: defectNames || "-" },
      { label: "สถานี:", value: data?.station ?? "-" },
      { label: "Roll Width:", value: data?.roll_width ?? "-" },
      { label: "สถานะปัจจุบัน:", value: currentState },
      { label: "Product Code:", value: data?.product_code ?? "-" },
      {
        label: "ตรวจพบเมื่อ:",
        value: data?.detected_at
          ? dayjs(data.detected_at).format(DATE_TIME_FORMAT)
          : "-",
      },
      { label: "Roll Number:", value: data?.roll_number ?? "-" },
    ],
    [
      lineCode,
      data?.job_order_number,
      data?.station,
      data?.roll_width,
      data?.product_code,
      data?.detected_at,
      data?.roll_number,
      defectNames,
      currentState,
    ]
  );

  return (
    <>
      <blockquote className="prose">รายละเอียดการผลิต</blockquote>
      <div className="grid w-full grid-cols-1 gap-2 p-4 border rounded md:grid-cols-2 lg:grid-cols-3">
        {details.map((item) => (
          <div key={item.label} className="flex flex-col">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="font-bold">{item.value}</span>
          </div>
        ))}
      </div>
    </>
  );
}
