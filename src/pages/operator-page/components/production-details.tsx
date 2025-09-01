import dayjs from "dayjs";
import { useCallback } from "react";

import { DATE_TIME_FORMAT } from "@/contants/format";
import { useLineAPI } from "@/hooks/line/use-line";

import type { StationItemType } from "@/types/station";

export default function ProductDetail({ data }: { data?: StationItemType }) {
  const { data: line } = useLineAPI();

  const getLineCode = useCallback(() => {
    return line?.data?.find((item) => Number(item.id) === Number(data?.line_id))
      ?.code;
  }, [line, data?.line_id]);

  return (
    <>
      <blockquote className="prose">รายละเอียดการผลิต</blockquote>
      <div className="grid w-full grid-cols-1 gap-2 p-4 border rounded md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            label: "Production Line:",
            value: getLineCode(),
          },
          {
            label: "Job Order Number:",
            value: data?.line_id,
          },
          {
            label: "ประเภท Defect:",
            value: data?.ai_note,
          },
          {
            label: "สถานี:",
            value: data?.station,
          },
          {
            label: "Roll Width:",
            value: data?.roll_width,
          },
          {
            label: "สถานะปัจจุบัน:",
            value: data?.scrap_confirmed_at,
          },
          {
            label: "Product Code:",
            value: data?.product_code,
          },
          {
            label: "ตรวจพบเมื่อ:",
            value: dayjs(data?.detected_at).format(DATE_TIME_FORMAT),
          },
          {
            label: "Roll Number:",
            value: data?.roll_number,
          },
        ].map((item) => (
          <div key={item.label} className="flex flex-col">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="font-bold">{item.value}</span>
          </div>
        ))}
      </div>
    </>
  );
}
