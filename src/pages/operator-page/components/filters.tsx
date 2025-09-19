import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { FilterIcon, RotateCcwIcon } from "lucide-react";
import { useWatch } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useQueryState } from "nuqs";
import { isArray } from "radash";
import dayjs from "dayjs";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { InputDate } from "@/components/ui/input-date";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UseOperatorFilters from "../hooks/use-operator-filters";

import { useStationStatusOptions } from "@/hooks/option/use-station-status-option";
import { filtersSchema } from "../schema";
import { useAuth } from "@/hooks/auth/use-auth-v2";
import { ROLES } from "@/contants/auth";
import { DATE_TIME_FORMAT } from "@/contants/format";
import { useProductionLineOptions } from "@/hooks/option/use-production-line-option";
import { cn } from "@/lib/utils";

export default function Filters() {
  const { user } = useAuth();
  const { values: filters, setters } = UseOperatorFilters();
  const [toggleFilter, setToggleFilter] = useState(false);

  const { data: productionLineOptions } = useProductionLineOptions();
  const [lineId] = useQueryState("line_id", {
    defaultValue: user?.line?.id
      ? String(user?.line?.id)
      : isArray(productionLineOptions)
      ? String(productionLineOptions[0].value)
      : "",
  });

  const disabledLine = [ROLES.OPERATOR as string].includes(String(user?.role));

  const form = useForm<z.infer<typeof filtersSchema>>({
    defaultValues: {
      product_code: filters.product_code || "",
      roll_id: filters.roll_id || "",
      number: filters.number || "",
      roll_width_max: filters.roll_width_max || "",
      roll_width_min: filters.roll_width_min || "",
      job_order_number: filters.job_order_number || "",
      status: undefined,
      detected_from: filters.detected_from || "",
      detected_to: filters.detected_to || "",
      line_id: filters.detected_to || "",
    },
    resolver: zodResolver(filtersSchema),
  });

  const values = useWatch({ control: form.control });
  const filledCount = Object.values(values).filter((v) => v && v !== "").length;
  const statusOptions = useStationStatusOptions();

  const isOperator = user?.role === ROLES.OPERATOR;
  const calendarDisabled = isOperator
    ? {
        before: dayjs().subtract(30, "day").toDate(),
        after: dayjs().toDate(),
      }
    : undefined;

  useEffect(() => {
    setters.setProductCode(values.product_code ?? "");
    setters.setRollId(values.roll_id ?? "");
    setters.setNumber(values.number ?? "");
    setters.setJobOrderNumber(values.job_order_number ?? "");
    setters.setRollWidthMin(
      values.roll_width_min ? String(values.roll_width_min) : ""
    );
    setters.setRollWidthMax(
      values.roll_width_max ? String(values.roll_width_max) : ""
    );
    setters.setStatus(values.status?.length ? values.status.join(",") : "");
    setters.setDetectedFrom(
      values.detected_from ? dayjs(values.detected_from)?.toISOString() : ""
    );
    setters.setDetectedTo(
      values.detected_to ? dayjs(values.detected_to)?.toISOString() : ""
    );
    setters.setLineId(values.line_id || "");
  }, [values, setters]);

  const handleClear = useCallback(() => {
    form.setValue("product_code", "");
    form.setValue("roll_id", "");
    form.setValue("number", "");
    form.setValue("job_order_number", "");
    form.setValue("roll_width_min", "");
    form.setValue("roll_width_max", "");
    form.setValue("status", undefined);
    form.setValue("detected_from", "");
    form.setValue("detected_to", "");
    form.setValue("line_id", "");
  }, [form]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <p>Production Line:</p>
        <Select
          value={lineId || productionLineOptions?.[0]?.value}
          onValueChange={setters.setLineId}
          disabled={disabledLine}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select a line" />
          </SelectTrigger>
          <SelectContent>
            {productionLineOptions?.map((line) => (
              <SelectItem key={line.value} value={line.value}>
                {line.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant={toggleFilter ? "default" : "outline"}
          onClick={() => setToggleFilter(!toggleFilter)}
        >
          <FilterIcon /> ตัวกรอง
        </Button>
      </div>
      <div
        className={cn(
          "p-4 py-6 space-y-3 bg-white border rounded",
          !toggleFilter && "hidden"
        )}
      >
        <div className="flex items-center justify-between">
          <p>ตัวกรอง</p>
          <div className="flex items-center gap-2">
            <p className="text-sm">จำนวนตัวกรองที่กรอก: {filledCount}</p>
            <Button
              size="sm"
              variant="outline"
              disabled={filledCount === 0}
              onClick={handleClear}
            >
              <RotateCcwIcon />
              ล้างตัวกรอง
            </Button>
          </div>
        </div>
        <Form {...form}>
          <form className="grid items-baseline grid-cols-1 gap-4 md:grid-cols-4">
            <FormField
              control={form.control}
              name="product_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Code</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="ค้นหา Product Code"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roll_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roll Id</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ค้นหา Roll Id" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roll/Bundle Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ค้นหา Roll/Bundle Number" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="job_order_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Order Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ค้นหา Job Order Number" />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2">
              <div className="flex items-end gap-2">
                <FormField
                  control={form.control}
                  name="roll_width_min"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Roll Width (Min)</FormLabel>
                      <Input
                        {...field}
                        placeholder="Min"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value && isNaN(Number(value))) {
                            form.setError("roll_width_min", {
                              type: "manual",
                              message: "Min ต้องเป็นตัวเลข",
                            });
                          } else {
                            form.clearErrors("roll_width_min");
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormItem>
                  )}
                />
                <span>-</span>
                <FormField
                  control={form.control}
                  name="roll_width_max"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Roll Width (Max)</FormLabel>
                      <Input
                        {...field}
                        placeholder="Max"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value && isNaN(Number(value))) {
                            form.setError("roll_width_max", {
                              type: "manual",
                              message: "Max ต้องเป็นตัวเลข",
                            });
                          } else {
                            form.clearErrors("roll_width_max");
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <MultiSelect
                      placeholder="เลือกสถานะ"
                      options={statusOptions}
                      value={field.value as string[]}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="detected_from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>วันที่เริ่มต้น</FormLabel>
                  <FormControl>
                    <InputDate
                      time
                      format={DATE_TIME_FORMAT}
                      value={
                        field.value ? dayjs(field.value).toDate() : undefined
                      }
                      onChange={field.onChange}
                      placeholder="วันที่เริ่มต้น"
                      calendarProps={{ disabled: calendarDisabled }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="detected_to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>วันที่สิ้นสุด</FormLabel>
                  <FormControl>
                    <InputDate
                      dayBoundary="end"
                      time
                      format={DATE_TIME_FORMAT}
                      value={
                        field.value ? dayjs(field.value).toDate() : undefined
                      }
                      onChange={field.onChange}
                      placeholder="วันที่สิ้นสุด"
                      calendarProps={{ disabled: calendarDisabled }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
