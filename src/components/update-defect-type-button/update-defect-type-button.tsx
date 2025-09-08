import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "../ui/label";

import { useDefectOptionAPI } from "@/hooks/option/use-defect-option";
import { updateDefectTypeSchema } from "./schema";

import type { UpdateDefectTypeT } from "./type";

export default function UpdateDefectTypeButton({ itemId }: { itemId: string }) {
  const [open, setOpen] = useState(false);

  const { data: defectOptions } = useDefectOptionAPI();

  const toggleOpen = () => {
    setOpen((prev) => !prev);
    form.reset();
  };

  const form = useForm<UpdateDefectTypeT>({
    defaultValues: {
      type: undefined,
    },
    resolver: zodResolver(updateDefectTypeSchema),
  });

  const handleSubmit = (value: UpdateDefectTypeT) => {
    console.log(itemId, value);
    toast.success("อัพเดทประเภท Defect สำเร็จ");
    setOpen(false);
  };

  const handleOnCheckedChange = (value: string) => (checked: boolean) => {
    const currentType = form.getValues("type") || [];
    if (checked) {
      form.setValue("type", [...currentType, value]);
    } else {
      form.setValue(
        "type",
        currentType.filter((item) => item !== value)
      );
    }

    form.trigger("type");
  };

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogTrigger>
        <Button className="bg-amber-600 hover:bg-amber-600/90">
          แก้ไขประเภท Defect
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>แก้ไขประเภท Defect</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form className="space-y-8">
              <FormField
                name="type"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div>
                      <FormLabel className="text-base">
                        เลือกประเภท Defect
                      </FormLabel>
                    </div>
                    {defectOptions?.map((item) => (
                      <FormField
                        key={item.value}
                        control={form.control}
                        name={field.name}
                        render={() => {
                          return (
                            <FormItem
                              key={item.value}
                              className="flex flex-row items-center gap-2"
                            >
                              <FormControl>
                                <Label className="hover:bg-accent/50 flex items-start gap-3 rounded border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950 w-full">
                                  <Checkbox
                                    id={item.value}
                                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                                    value={item.value}
                                    checked={field.value?.includes(item.value)}
                                    onCheckedChange={handleOnCheckedChange(
                                      item.value
                                    )}
                                  />
                                  <div className="grid gap-1.5 font-normal">
                                    <p className="text-sm font-medium leading-none">
                                      {item.label}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {item.meta?.code}
                                    </p>
                                  </div>
                                </Label>
                              </FormControl>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
            ยืนยัน
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
