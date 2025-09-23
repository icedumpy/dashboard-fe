import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { FilterIcon, RotateCcwIcon } from "lucide-react";
import { useWatch } from "react-hook-form";
import { useForm } from "react-hook-form";
import { isEmpty } from "radash";
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
import useItemFilters from "../hooks/use-item-filters";

import { useStationStatusOptions } from "@/hooks/option/use-station-status-option";
import { filtersSchema } from "../schema";
import { useAuth } from "@/hooks/auth/use-auth";
import { ROLES } from "@/constants/auth";
import { DATE_TIME_FORMAT } from "@/constants/format";
import { useProductionLineOptions } from "@/hooks/option/use-production-line-option";
import { cn } from "@/lib/utils";

export default function Filters() {
  const { user } = useAuth();
  const { filters, setFilters } = useItemFilters();
  const [toggleFilter, setToggleFilter] = useState(false);
  const { data: productionLineOptions } = useProductionLineOptions();
  const disabledLine = [ROLES.OPERATOR as string].includes(String(user?.role));

  // TODO: Find a better way to avoid not using form
  const form = useForm<z.infer<typeof filtersSchema>>({
    defaultValues: {
      product_code: undefined,
      roll_id: undefined,
      number: undefined,
      roll_width_max: undefined,
      roll_width_min: undefined,
      job_order_number: undefined,
      status: undefined,
      detected_from: undefined,
      detected_to: undefined,
      line_id: undefined,
    },
    resolver: zodResolver(filtersSchema),
  });

  useEffect(() => {
    form.reset({
      ...filters,
      status: filters.status
        ? filters.status.split(",").filter(Boolean)
        : undefined,
    });
  }, [filters, form]);

  const values = useWatch({ control: form.control });
  const filledCount = Object.entries(values).filter(
    ([key, v]) => key !== "line_id" && isEmpty(v) === false
  ).length;

  const statusOptions = useStationStatusOptions();
  const isOperator = user?.role === ROLES.OPERATOR;
  const calendarDisabled = isOperator
    ? {
        before: dayjs().subtract(30, "day").toDate(),
        after: dayjs().toDate(),
      }
    : undefined;

  const handleClear = useCallback(() => {
    form.reset();
    setFilters({
      product_code: "",
      roll_id: "",
      number: "",
      roll_width_max: "",
      roll_width_min: "",
      job_order_number: "",
      status: "",
      detected_from: "",
      detected_to: "",
      line_id: isEmpty(user?.line?.id)
        ? productionLineOptions?.[0]?.value ?? ""
        : String(user?.line?.id),
    });
  }, [form, setFilters, user?.line?.id, productionLineOptions]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <p>Production Line:</p>
        <Select
          value={filters?.line_id}
          onValueChange={(lineId) =>
            setFilters({ ...filters, line_id: lineId })
          }
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
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value);
                        setFilters({ ...filters, product_code: value });
                      }}
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
                    <Input
                      value={field.value}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value);
                        setFilters({ ...filters, roll_id: value });
                      }}
                      placeholder="ค้นหา Roll Id"
                    />
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
                    <Input
                      value={field.value}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value);
                        setFilters({ ...filters, number: value });
                      }}
                      placeholder="ค้นหา Roll/Bundle Number"
                    />
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
                    <Input
                      value={field.value}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value);
                        setFilters({ ...filters, job_order_number: value });
                      }}
                      placeholder="ค้นหา Job Order Number"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2">
              <div className="flex items-end">
                <FormField
                  control={form.control}
                  name="roll_width_min"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Roll Width</FormLabel>
                      <Input
                        placeholder="Min"
                        className="rounded-tr-none rounded-br-none"
                        value={field.value}
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
                            setFilters({ ...filters, roll_width_min: value });
                          }
                        }}
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roll_width_max"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel></FormLabel>
                      <Input
                        placeholder="Max"
                        className="border-l-0 rounded-tl-none rounded-bl-none"
                        value={field.value}
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
                            setFilters({ ...filters, roll_width_max: value });
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
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        setFilters({ ...filters, status: value.join(",") });
                      }}
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
                      onChange={(value) => {
                        field.onChange(value);
                        setFilters({
                          ...filters,
                          detected_from: value
                            ? dayjs(value).toISOString()
                            : "",
                        });
                      }}
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
                      onChange={(value) => {
                        field.onChange(value);
                        setFilters({
                          ...filters,
                          detected_to: value ? dayjs(value).toISOString() : "",
                        });
                      }}
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
