import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { isEmpty } from "radash";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";

import { STATUS_OPTIONS } from "./constants";
import { updateStatusSchema } from "./schema";
import { useItemDetailAPI } from "@/shared/hooks/item/use-item-detail";
import { useChangeStatus } from "@/shared/hooks/change-status/use-create-change-status";
import { ITEM_ENDPOINT } from "@/shared/constants/api";
import { useDefectOptionAPI } from "@/shared/hooks/option/use-defect-option";
import { STATION } from "@/shared/constants/station";
import { STATUS } from "@/shared/constants/status";

import type { UpdateStatusT } from "./types";

export default function UpdateStatusButton({
  itemId,
  stationType,
  disabled,
}: {
  itemId: string;
  stationType: (typeof STATION)[keyof typeof STATION];
  disabled?: boolean;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: defectOptions } = useDefectOptionAPI();
  const { data } = useItemDetailAPI(itemId, {
    enabled: !!itemId && open,
  });

  const isItemStatusDefect = data?.data.status_code === STATUS.DEFECT;
  const changeStatus = useChangeStatus();

  const form = useForm<UpdateStatusT>({
    defaultValues: {
      statusId: undefined,
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

      const statusId = STATUS_OPTIONS.find(
        (option) => option.label === data.data.status_code
      )?.value;

      form.reset({
        statusId: statusId,
        defect_type_ids: isEmpty(defectIds) ? undefined : defectIds,
      });
    }
  }, [data?.data, data?.defects, defectOptions, form]);

  const handleSubmit = (values: UpdateStatusT) => {
    changeStatus.mutate(
      {
        item_id: Number(itemId),
        to_status_id: Number(values.statusId),
        defect_type_ids: values?.defect_type_ids,
        reason: "",
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
          (option) => option.label === STATUS.DEFECT
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
        <Button disabled={disabled}>แก้ไขสถานะ</Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>แก้ไขสถานะ</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form className="space-y-2">
              <FormField
                name="statusId"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>เลือกสถานะ</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                          if (value !== STATUS.DEFECT) {
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

                    {form.watch("statusId") === STATUS_OPTIONS[2].value && (
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
            disabled={!form.formState.isValid || changeStatus.isPending}
            onClick={form.handleSubmit(handleSubmit)}
          >
            ยืนยัน
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
