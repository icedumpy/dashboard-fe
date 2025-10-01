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
import { DATE_TIME_FORMAT } from "@/constants/format";
import { useDefectOptionAPI } from "@/hooks/option/use-defect-option";
import { updateItemDetailsSchema } from "../schema";
import {
  getCurrentState,
  getDefectNames,
  getLineCode,
  canEditItemDetail,
} from "@/helpers/item";
import { ITEM_ENDPOINT } from "@/constants/api";
import { useItemUpdate } from "@/hooks/item/use-item-update";
import { useAuth } from "@/hooks/auth/use-auth";
import useItemFilters from "@/pages/operator-page/hooks/use-item-filters";

import type { StationDetailResponse } from "@/types/item";
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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { filters } = useItemFilters();
  const { data: lines } = useLineAPI();
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
      job_order_number: data?.job_order_number || "",
      roll_id: data?.roll_id || "",
      roll_number: data?.roll_number || "",
      bundle_number: data?.bundle_number || "",
      product_code: data?.product_code || "",
    });
  }, [data, form]);

  const lineCode = getLineCode(Number(filters.line_id), lines?.data);
  const defectNames = getDefectNames(defects, defectOptions);
  const currentState = getCurrentState(reviews);
  const canEditItem = canEditItemDetail(user?.role);

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
        {canEditItem && (
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
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setMode("VIEW");
                    form.clearErrors();
                    form.reset();
                  }}
                >
                  ยกเลิก
                </Button>
                <Button
                  size="sm"
                  onClick={form.handleSubmit(handleSubmit)}
                  disabled={itemUpdate.isPending}
                >
                  บันทึก
                </Button>
              </>
            )}
          </div>
        )}
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
                        value={field.value ?? ""}
                        onChange={(e) => {
                          if (item.name === "roll_width") {
                            const numericValue = e.target.value.replace(
                              /\D/g,
                              ""
                            );
                            field.onChange(
                              numericValue ? Number(numericValue) : ""
                            );
                            form.trigger(item.name as keyof UpdateItemDetail);
                          } else {
                            field.onChange(e.target.value);
                            form.trigger(item.name as keyof UpdateItemDetail);
                          }
                        }}
                        min={item.name === "roll_width" ? 0 : undefined}
                        inputMode={
                          item.name === "roll_width" ? "numeric" : undefined
                        }
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
