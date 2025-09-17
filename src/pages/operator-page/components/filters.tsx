import { RotateCcwIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
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

import { useStationStatusOptions } from "@/hooks/option/use-station-status-option";
import { filtersSchema } from "../schema";
import { useAuth } from "@/hooks/auth/use-auth";
import { ROLES } from "@/contants/auth";

export default function Filters() {
  const { user } = useAuth();
  const form = useFormContext<z.infer<typeof filtersSchema>>();
  const values = form.watch();
  const filledCount = Object.values(values).filter((v) => v && v !== "").length;
  const statusOptions = useStationStatusOptions();

  const isOperator = user?.role === ROLES.OPERATOR;
  const calendarDisabled = isOperator
    ? {
        before: dayjs().subtract(30, "day").toDate(),
        after: dayjs().toDate(),
      }
    : undefined;

  return (
    <div className="p-4 py-6 space-y-3 bg-white border rounded">
      <div className="flex items-center justify-between">
        <p>ตัวกรอง</p>
        <div className="flex items-center gap-2">
          <p className="text-sm">จำนวนตัวกรองที่กรอก: {filledCount}</p>
          <Button
            size="sm"
            variant="outline"
            disabled={filledCount === 0}
            onClick={() => form.reset()}
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
                  <Input {...field} placeholder="ค้นหา Product Code" />
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
  );
}
