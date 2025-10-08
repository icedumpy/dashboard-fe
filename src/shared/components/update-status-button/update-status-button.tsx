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

import { updateStatusSchema } from "./schema";
import { useItemDetailAPI } from "@/shared/hooks/item/use-item-detail";
import { useChangeStatus } from "@/shared/hooks/change-status/use-create-change-status";
import { ITEM_ENDPOINT } from "@/shared/constants/api";
import { useDefectOptionAPI } from "@/shared/hooks/option/use-defect-option";
import { STATION } from "@/shared/constants/station";
import { STATUS } from "@/shared/constants/status";
import { useGetItemStatusAPI } from "@/shared/hooks/item-status/use-get-item-status";

import type { UpdateStatusButtonProps, UpdateStatusT } from "./types";
import type { OptionT } from "@/shared/types/option";

export default function UpdateStatusButton({
  itemId,
  station,
  disabled,
}: UpdateStatusButtonProps & { disabled?: boolean }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: defectOptions } = useDefectOptionAPI();
  const { data } = useItemDetailAPI(itemId, {
    enabled: !!itemId && open,
  });
  const { data: itemStatus } = useGetItemStatusAPI();
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

      const statusId = itemStatus?.data?.find(
        (option) => option.code === data.data.status_code
      )?.id;

      form.reset({
        statusId: String(statusId),
        defect_type_ids: isEmpty(defectIds) ? undefined : defectIds,
      });
    }
  }, [data?.data, data?.defects, defectOptions, form, itemStatus?.data]);

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
    const allowedCodes = [STATUS.NORMAL, STATUS.SCRAP, STATUS.DEFECT];

    const mapped = (itemStatus?.data ?? [])
      .map((s) => ({
        label: s.name_th,
        value: String(s.id),
        meta: { code: s.code },
      }))
      .filter((opt) => allowedCodes.includes(String(opt.meta?.code)))
      .sort(
        (a, b) =>
          allowedCodes.indexOf(String(a.meta?.code)) -
          allowedCodes.indexOf(String(b.meta?.code))
      );

    const currentStatus = data?.data?.status_code;

    // If current status is NORMAL or SCRAP, only show DEFECT option (for both ROLL & BUNDLE)
    if (
      currentStatus &&
      [STATUS.NORMAL, STATUS.SCRAP].includes(currentStatus)
    ) {
      // ✅ Only return the DEFECT option, do not add leftoverRoll
      return mapped.filter((o) => String(o.meta?.code) === STATUS.DEFECT);
    }

    // If current status is other (DEFECT, etc.), show all options
    let allOptions: OptionT[] = mapped;

    // For BUNDLE stations: add LEFTOVER_ROLL option if available
    // ✅ Only when current status is not NORMAL or SCRAP
    if (station !== STATION.ROLL) {
      const leftoverRoll = itemStatus?.data?.find(
        (s) => s.code === STATUS.LEFTOVER_ROLL
      );

      if (leftoverRoll) {
        const leftoverOption: OptionT = {
          label: leftoverRoll.name_th,
          value: String(leftoverRoll.id),
          meta: { code: leftoverRoll.code },
        };

        const exists = allOptions.some((m) => m.value === leftoverOption.value);
        allOptions = exists ? allOptions : [...allOptions, leftoverOption];
      }
    }

    return allOptions;
  }, [itemStatus?.data, station, data?.data?.status_code]);

  const rollDefectTypeOptions = useMemo(() => {
    return defectOptions?.filter((option) =>
      ["LABEL", "BARCODE", "SCRATCH"].includes(String(option.meta?.code))
    );
  }, [defectOptions]);

  const bundledDefectTypeOptions = useMemo(() => {
    return defectOptions;
  }, [defectOptions]);

  const defectStatus = useMemo(() => {
    return statusOptions.find(
      (option) => option?.meta?.code === String(STATUS.DEFECT)
    );
  }, [statusOptions]);

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
                          <>
                            <FormItem key={option.value}>
                              <FormControl>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value={String(option.value)}
                                    id={String(option.value)}
                                  />
                                  <Label htmlFor={String(option.value)}>
                                    {option.label}
                                  </Label>
                                </div>
                              </FormControl>
                            </FormItem>
                            {form.watch("statusId") === defectStatus?.value &&
                              option.value === defectStatus?.value && (
                                <>
                                  {station === STATION.ROLL ? (
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
                                          {rollDefectTypeOptions?.map(
                                            (item) => (
                                              <FormItem
                                                key={item.value}
                                                className="w-full"
                                              >
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
                                            )
                                          )}
                                        </RadioGroup>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  ) : (
                                    <FormItem>
                                      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                                        {bundledDefectTypeOptions?.map(
                                          (item) => (
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
                                                  ?.includes(
                                                    Number(item.value)
                                                  )}
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
                                          )
                                        )}
                                      </div>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                </>
                              )}
                          </>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
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
