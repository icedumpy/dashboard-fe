import { RotateCcwIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";

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

import { useStationStatusOptions } from "@/hooks/option/use-station-status-option";
import { filtersSchema } from "../schema";

export default function Filters() {
  const DEFAULT_VALUES = {
    product_code: undefined,
    roll_number: undefined,
    job_order_number: undefined,
    roll_width: undefined,
    status: [],
    time_range: undefined,
    station: undefined,
    detected_to: dayjs().toISOString(),
    detected_from: dayjs().toISOString(),
    line_id: undefined,
  };

  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(filtersSchema),
  });

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
          className="grid grid-cols-1 gap-4 md:grid-cols-4"
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
            name="roll_number"
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
            name="roll_width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roll Width</FormLabel>
                <Input {...field} />
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
            name="detected_to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>วันที่เริ่มต้น</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="detected_from"
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
