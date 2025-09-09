import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useItemStatusUpdate } from "@/hooks/item/use-item-status-update";
import { ITEM_ENDPOINT } from "@/contants/api";
import { updateStatusSchema } from "./schema";
import { STATUS_OPTIONS } from "./constants";

import type { UpdateStatusButtonProps, UpdateStatusT } from "./types";

export default function UpdateStatusButton({
  itemId,
}: UpdateStatusButtonProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const updateItemStatus = useItemStatusUpdate();
  const form = useForm<UpdateStatusT>({
    defaultValues: {
      status: undefined,
      defect_type_ids: undefined,
    },
    resolver: zodResolver(updateStatusSchema),
  });

  const toggleOpen = () => {
    setOpen((prev) => !prev);
    form.reset();
  };

  const handleSubmit = (values: UpdateStatusT) => {
    updateItemStatus.mutate(
      {
        itemId: String(itemId),
        status: values.status,
        defect_type_ids: values.defect_type_ids,
      },
      {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: [ITEM_ENDPOINT, itemId] });
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
  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogTrigger>
        <Button className="bg-amber-600 hover:bg-amber-600/90">
          แก้ไขสถานะ
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>แก้ไขสถานะ</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>เลือกสถานะ</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col"
                      >
                        {STATUS_OPTIONS?.map((option) => (
                          <FormItem
                            className="flex items-center gap-3"
                            key={option?.value}
                          >
                            <FormControl>
                              <RadioGroupItem value={option?.value} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {option?.label}
                            </FormLabel>
                          </FormItem>
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
            disabled={updateItemStatus.isPending || !form.formState.isValid}
            onClick={form.handleSubmit(handleSubmit)}
          >
            ยืนยัน
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
