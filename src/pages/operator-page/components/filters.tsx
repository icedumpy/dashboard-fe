import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RotateCcwIcon } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";

export default function Filters() {
  const DEFAULT_VALUES = {
    productCode: "",
    rollNumber: "",
    jobOrderNumber: "",
    rollWidth: "",
    status: "",
    timeRange: "",
    startDate: "",
    endDate: "",
  };

  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  const values = form.watch();
  const filledCount = Object.values(values).filter((v) => v && v !== "").length;

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
      <FormProvider {...form}>
        <form
          className="grid grid-cols-1 gap-4 md:grid-cols-4"
          onSubmit={form.handleSubmit((data) => console.log(data))}
        >
          <FormField
            control={form.control}
            name="productCode"
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
            name="productCode"
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
            name="productCode"
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
            name="rollWidth"
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
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ช่วงเวลา</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
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
            name="endDate"
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
      </FormProvider>
    </div>
  );
}
