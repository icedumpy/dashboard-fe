import { RotateCcwIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";

import { useStationStatusOptions } from "@/hooks/option/use-station-status-option";

export default function Filters() {
  const DEFAULT_VALUES = {
    product_code: undefined,
    roll_number: undefined,
    job_order_number: undefined,
    number: undefined,
    status: [],
    time_range: undefined,
    station: undefined,
    detected_to: dayjs().toISOString(),
    detected_from: dayjs().toISOString(),
    line_id: undefined,
  };

  const form = useFormContext();

  const values = form.watch();
  const filledCount = Object.values(values).filter((v) => v && v !== "").length;

  const statusOptions = useStationStatusOptions();

  return (
    <div className="p-4 py-6 space-y-3 border rounded">
      <div className="flex items-center justify-between">
        <p>ตัวกรอง</p>
        <div className="flex items-center gap-2">
          <p className="text-sm">จำนวนตัวกรองที่กรอก: {filledCount}</p>
          <Button
            size="sm"
            variant="outline"
            disabled={filledCount === 0}
            onClick={() => form.reset(DEFAULT_VALUES)}
          >
            <RotateCcwIcon />
            ล้างตัวกรอง
          </Button>
        </div>
      </div>
      <Form {...form}>
        <form
          className="grid items-baseline grid-cols-1 gap-4 md:grid-cols-4"
          onSubmit={form.handleSubmit((data) => console.log(data))}
        >
          <FormField
            control={form.control}
            name="product_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Code</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="roll_width_min"
            render={() => (
              <FormItem>
                <FormLabel>Roll Width</FormLabel>
                <Input
                  onChange={(e) => {
                    const value = e.target.value;
                    const [min, max] = value.split("-").map((v) => v.trim());

                    // Simple validation: check if min is a valid number
                    if (min && isNaN(Number(min))) {
                      form.setError("roll_width_min", {
                        type: "manual",
                        message: "Min width ต้องเป็นตัวเลข",
                      });
                    } else {
                      form.clearErrors("roll_width_min");
                      form.setValue("roll_width_min", +min);
                      form.setValue("roll_width_max", +max);
                      form.trigger("roll_width_min");
                    }
                  }}
                />
                <FormDescription className="text-xs">
                  ใส่ค่าเดียว หรือช่วง (100-200)
                </FormDescription>
              </FormItem>
            )}
          />
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
                    value={field.value as unknown as string[]}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="detected_to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ช่วงเวลา</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="detected_from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>วันที่เริ่มต้น</FormLabel>
                <FormControl>
                  <Input className="w-full" type="date" {...field} />
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
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
