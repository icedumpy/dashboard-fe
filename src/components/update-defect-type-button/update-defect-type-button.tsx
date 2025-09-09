import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";

import { useItemStatusUpdate } from "@/hooks/item/use-item-status-update";
import { useDefectOptionAPI } from "@/hooks/option/use-defect-option";
import { updateDefectTypeSchema } from "./schema";
import { STATION_STATUS } from "@/contants/station";
import { ITEM_ENDPOINT } from "@/contants/api";

import type { UpdateDefectTypeT } from "./type";
import type { StationDetailResponse } from "@/types/station";

export default function UpdateDefectTypeButton({
  itemId,
  defects,
}: {
  itemId: string;
  defects: StationDetailResponse["defects"];
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: defectOptions } = useDefectOptionAPI();
  const updateItemStatus = useItemStatusUpdate();

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

  useEffect(() => {
    if (defects && defectOptions) {
      const defaultDefectTypeIds =
        defects
          .map(
            (defect) =>
              defectOptions.find(
                (option) => option.meta?.code === defect.defect_type_code
              )?.value
          )
          .filter(Boolean)
          .map(Number) ?? [];

      form.reset({
        type: defaultDefectTypeIds,
      });
    }
  }, [defects, defectOptions, form]);

  const handleSubmit = (value: UpdateDefectTypeT) => {
    updateItemStatus.mutate(
      {
        itemId: String(itemId),
        status: STATION_STATUS.DEFECT,
        defect_type_ids: value.type.map(Number),
      },
      {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: [ITEM_ENDPOINT, itemId] });
          queryClient.invalidateQueries({ queryKey: [ITEM_ENDPOINT] });
          toast.success("อัพเดตสถานะสำเร็จ");
          form.reset();
          setOpen(false);
        },
        onError(error) {
          toast.error("อัพเดตสถานะไม่สำเร็จ", {
            description: error.message,
          });
        },
      }
    );

    setOpen(false);
  };

  const handleOnCheckedChange = (value: string) => (checked: boolean) => {
    const currentType = form.getValues("type") || [];
    if (checked) {
      form.setValue("type", [...currentType, Number(value)]);
    } else {
      form.setValue(
        "type",
        currentType.filter((item) => item !== Number(value))
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
                                    checked={field.value?.includes(
                                      Number(item.value)
                                    )}
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
