import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "radash";
import { toast } from "sonner";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useLineAPI } from "@/hooks/line/use-line";
import { DATE_TIME_FORMAT } from "@/contants/format";
import { useDefectOptionAPI } from "@/hooks/option/use-defect-option";
import { REVIEW_STATE_OPTION } from "@/contants/review";
import { updateItemDetailsSchema } from "../schema";

import type { StationDetailResponse } from "@/types/station";
import type { UpdateItemDetail } from "../types";

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
  const [mode, setMode] = useState<"VIEW" | "EDIT">("VIEW");

  const form = useForm({
    defaultValues: {
      roll_id: undefined,
      job_order_number: undefined,
      roll_width: undefined,
      product_code: undefined,
      roll_number: undefined,
    },
    resolver: zodResolver(updateItemDetailsSchema),
  });

  useEffect(() => {
    if (data) {
      form.reset({
        roll_id: data?.roll_id || undefined,
        job_order_number: data?.job_order_number || undefined,
        roll_width: String(data?.roll_width) || undefined,
        product_code: data?.product_code || undefined,
        roll_number: data?.roll_number || undefined,
      });
    }
  }, [data, form]);

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

  const fields = [
    "roll_id",
    "job_order_number",
    "roll_width",
    "product_code",
    "roll_number",
  ];

  const dataList = useMemo(
    () => [
      { label: "Production Line:", name: "line_code", value: lineCode },
      {
        label: "Job Order Number:",
        name: "job_order_number",
        value: data?.job_order_number ?? "-",
      },
      {
        label: "ประเภท Defect:",
        name: "defect_type",
        value: defectNames || "-",
      },
      { label: "Roll ID:", name: "roll_id", value: data?.roll_id ?? "-" },
      { label: "สถานี:", name: "station", value: data?.station ?? "-" },
      {
        label: "Roll Width:",
        name: "roll_width",
        value: data?.roll_width ?? "-",
      },
      { label: "สถานะปัจจุบัน:", name: "current_state", value: currentState },
      {
        label: "Product Code:",
        name: "product_code",
        value: data?.product_code ?? "-",
      },
      {
        label: "ตรวจพบเมื่อ:",
        name: "detected_at",
        value: data?.detected_at
          ? dayjs(data.detected_at).format(DATE_TIME_FORMAT)
          : "-",
      },
      {
        label: "Roll Number:",
        name: "roll_number",
        value: data?.roll_number ?? "-",
      },
    ],
    [
      lineCode,
      data?.job_order_number,
      data?.roll_id,
      data?.station,
      data?.roll_width,
      data?.product_code,
      data?.detected_at,
      data?.roll_number,
      defectNames,
      currentState,
    ]
  );

  const handleSubmit = (values: UpdateItemDetail) => {
    // TODO: API update details
    console.log(values);
    setMode("VIEW");
    toast.success("บันทึกสำเร็จ");
  };

  return (
    <>
      <div className="flex items-baseline justify-between">
        <blockquote className="prose">รายละเอียดการผลิต</blockquote>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMode(mode === "VIEW" ? "EDIT" : "VIEW")}
          >
            แก้ไขรายละเอียด
          </Button>
          {mode === "EDIT" && (
            <Button size="sm" onClick={form.handleSubmit(handleSubmit)}>
              บันทึก
            </Button>
          )}
        </div>
      </div>
      <Form {...form}>
        <form className="grid w-full grid-cols-1 gap-2 p-4 border rounded md:grid-cols-2 lg:grid-cols-3">
          {dataList.map((item) => (
            <FormField
              key={item.label}
              name={item.name || ""}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{item.label}</FormLabel>
                  <FormControl>
                    {mode === "EDIT" && fields.includes(item.name) ? (
                      <Input
                        type="text"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    ) : (
                      <span className="py-1.5 font-bold">{item.value}</span>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </form>
      </Form>
    </>
  );
}
