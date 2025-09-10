import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { isEmpty } from "radash";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { STATUS_OPTIONS } from "./constants";
import { updateStatusSchema } from "./schema";
import { useItemDetailAPI } from "@/hooks/item/use-item-detail";
import { useItemStatusUpdate } from "@/hooks/item/use-item-status-update";
import { ITEM_ENDPOINT } from "@/contants/api";
import { useDefectOptionAPI } from "@/hooks/option/use-defect-option";
import { STATION, STATION_STATUS } from "@/contants/station";

import type { UpdateStatusT } from "./types";

export default function UpdateStatusButton({
  itemId,
  stationType,
}: {
  itemId: string;
  stationType: (typeof STATION)[keyof typeof STATION];
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: defectOptions } = useDefectOptionAPI();
  const { data } = useItemDetailAPI(itemId, {
    enabled: !!itemId && open,
  });

  const isItemStatusDefect = data?.data.status_code === STATION_STATUS.DEFECT;
  const itemUpdateStatus = useItemStatusUpdate();

  const form = useForm<UpdateStatusT>({
    defaultValues: {
      status: undefined,
      defect_type_ids: undefined,
    },
    resolver: zodResolver(updateStatusSchema),
  });

  useEffect(() => {
    if (data?.data) {
      const defectCodes =
        data.defects?.map((defect) => defect.defect_type_code) || [];

      const defectIds = defectCodes
        .map(
          (code) => defectOptions?.find((opt) => opt.meta?.code === code)?.value
        )
        .map(Number)
        .filter(Boolean);

      form.reset({
        status: data.data.status_code,
        defect_type_ids: isEmpty(defectIds) ? undefined : defectIds,
      });
    }
  }, [data?.data, data?.defects, defectOptions, form]);

  const handleSubmit = (values: UpdateStatusT) => {
    itemUpdateStatus.mutate(
      {
        itemId: String(itemId),
        status: values.status,
        defect_type_ids: values.defect_type_ids,
      },
      {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: [ITEM_ENDPOINT, itemId] });
          queryClient.invalidateQueries({
            queryKey: [ITEM_ENDPOINT],
            exact: false,
          });
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
  };

  const toggleOpen = (next: boolean) => {
    setOpen(next);
    form.reset();
  };

  const handleOnCheckedChange = (value: string) => (checked: boolean) => {
    const currentType = form.getValues("defect_type_ids") || [];
    if (checked) {
      form.setValue("defect_type_ids", [...currentType, Number(value)], {
        shouldDirty: true,
      });
    } else {
      form.setValue(
        "defect_type_ids",
        currentType.filter((item) => item !== Number(value)),
        {
          shouldDirty: true,
        }
      );
    }
    form.trigger("defect_type_ids");
  };

  const statusOptions = useMemo(() => {
    switch (isItemStatusDefect) {
      case true:
        return STATUS_OPTIONS;
      default:
        return STATUS_OPTIONS.filter(
          (option) => option.value === STATION_STATUS.DEFECT
        );
    }
  }, [isItemStatusDefect]);

  const rollDefectTypeOptions = useMemo(() => {
    return defectOptions?.filter((option) =>
      ["LABEL", "BARCODE"].includes(String(option.meta?.code))
    );
  }, [defectOptions]);

  const bundledDefectTypeOptions = useMemo(() => {
    return defectOptions;
  }, [defectOptions]);

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogTrigger asChild>
        <Button variant="update">แก้ไขสถานะ</Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>แก้ไขสถานะ </DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form className="space-y-2">
              <FormField
                name="status"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>เลือกสถานะ</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                          if (value !== STATION_STATUS.DEFECT) {
                            form.setValue("defect_type_ids", []);
                          }
                        }}
                        value={field.value}
                        className="grid grid-cols-1 gap-2 mb-0"
                      >
                        {statusOptions.map((option) => (
                          <FormItem key={option.value}>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={option.value}
                                  id={option.value}
                                />
                                <Label htmlFor={option.value}>
                                  {option.label}
                                </Label>
                              </div>
                            </FormControl>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />

                    {/* ✅ sub-field defect_type_ids */}
                    {form.watch("status") === STATION_STATUS.DEFECT && (
                      <>
                        {stationType === STATION.ROLL ? (
                          <FormItem className="pl-4">
                            <FormControl>
                              <RadioGroup
                                value={form
                                  .watch("defect_type_ids")?.[0]
                                  ?.toString()}
                                onValueChange={(value) => {
                                  form.setValue("defect_type_ids", [
                                    Number(value),
                                  ]);
                                  form.trigger("defect_type_ids");
                                }}
                                className="grid grid-cols-2"
                              >
                                {rollDefectTypeOptions?.map((item) => (
                                  <FormItem key={item.value} className="w-full">
                                    <FormControl>
                                      <Label
                                        htmlFor={`defect-radio-${item.value}`}
                                        className="hover:bg-accent/50 flex items-start gap-1 rounded border p-2 
                                        has-[[aria-checked=true]]:border-blue-600 
                                        has-[[aria-checked=true]]:bg-blue-50 
                                        dark:has-[[aria-checked=true]]:border-blue-900 
                                      dark:has-[[aria-checked=true]]:bg-blue-950"
                                      >
                                        <RadioGroupItem
                                          value={item.value.toString()}
                                          id={`defect-radio-${item.value}`}
                                          className="mr-2"
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
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        ) : (
                          <FormItem>
                            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                              {bundledDefectTypeOptions?.map((item) => (
                                <Label
                                  key={item.value}
                                  className="hover:bg-accent/50 flex items-start gap-1 rounded border p-2 
                                  has-[[aria-checked=true]]:border-blue-600 
                                  has-[[aria-checked=true]]:bg-blue-50 
                                  dark:has-[[aria-checked=true]]:border-blue-900 
                                  dark:has-[[aria-checked=true]]:bg-blue-950"
                                >
                                  <Checkbox
                                    id={item.value.toString()}
                                    value={item.value}
                                    checked={form
                                      .watch("defect_type_ids")
                                      ?.includes(Number(item.value))}
                                    onCheckedChange={handleOnCheckedChange(
                                      item.value
                                    )}
                                    className="data-[state=checked]:border-blue-600 
                                    data-[state=checked]:bg-blue-600 
                                    data-[state=checked]:text-white 
                                    dark:data-[state=checked]:border-blue-700 
                                    dark:data-[state=checked]:bg-blue-700"
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
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      </>
                    )}
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            disabled={!form.formState.isValid || itemUpdateStatus.isPending}
            onClick={form.handleSubmit(handleSubmit)}
          >
            ยืนยัน
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
