import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { updateItemDetailsSchema } from "../schema";
import { getCurrentState, getDefectNames, getLineCode } from "@/helpers/item";
import { ITEM_ENDPOINT } from "@/contants/api";
import { useItemUpdate } from "@/hooks/item/use-item-update";

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
  const queryClient = useQueryClient();
  const { data: line } = useLineAPI();
  const { data: defectOptions } = useDefectOptionAPI();
  const [mode, setMode] = useState<"VIEW" | "EDIT">("VIEW");
  const itemUpdate = useItemUpdate();

  const form = useForm({
    defaultValues: {
      roll_id: undefined,
      job_order_number: undefined,
      roll_width: undefined,
      product_code: undefined,
      roll_number: undefined,
      bundle_number: undefined,
    },
    resolver: zodResolver(updateItemDetailsSchema),
  });

  useEffect(() => {
    form.reset({
      ...data,
      roll_number: data?.roll_number || undefined,
      bundle_number: data?.bundle_number || undefined,
    });
  }, [data, form]);

  const lineCode = getLineCode(line?.data, Number(data?.line_id));
  const defectNames = getDefectNames(defects, defectOptions);
  const currentState = getCurrentState(reviews);

  const editableFields = useMemo(
    () =>
      Object.keys(updateItemDetailsSchema.shape) as Array<
        keyof UpdateItemDetail
      >,
    []
  );

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
    itemUpdate.mutate(
      {
        itemId: String(data?.id),
        ...values,
      },
      {
        onSuccess() {
          toast.success("แก้ไขรายละเอียดสำเร็จ");
          queryClient.invalidateQueries({
            queryKey: [ITEM_ENDPOINT, String(data?.id)],
          });
          queryClient.invalidateQueries({
            queryKey: [ITEM_ENDPOINT],
            exact: false,
          });
          setMode("VIEW");
        },
        onError(error) {
          toast.error("แก้ไขรายละเอียดไม่สำเร็จ", {
            description: error.message,
          });
        },
      }
    );
  };

  return (
    <>
      <div className="flex items-baseline justify-between">
        <blockquote className="prose">รายละเอียดการผลิต</blockquote>
        <div className="space-x-2">
          {mode === "VIEW" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMode(mode === "VIEW" ? "EDIT" : "VIEW")}
            >
              แก้ไขรายละเอียด
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={form.handleSubmit(handleSubmit)}
              disabled={itemUpdate.isPending}
            >
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
                    {mode === "EDIT" &&
                    editableFields.includes(
                      item.name as keyof UpdateItemDetail
                    ) ? (
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
