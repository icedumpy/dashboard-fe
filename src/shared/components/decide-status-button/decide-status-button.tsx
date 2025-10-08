import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
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
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/shared/components/ui/form";

import { useDecideStatus } from "@/shared/hooks/change-status/use-decide-status";
import { cn } from "@/lib/utils";
import { reviewSchema } from "../review-decision-button/schema";
import { useItemDetailAPI } from "@/shared/hooks/item/use-item-detail";
import { CHANGE_STATUS_ENDPOINT } from "@/shared/constants/api";
import { REVIEW_STATE } from "@/shared/constants/review";
import useDismissDialog from "@/shared/hooks/use-dismiss-dialog";

import type { DecideStatusButtonProps } from "./types";

export default function DecideStatusButton({
  itemId,
  decision,
  request_id,
  buttonProps,
}: DecideStatusButtonProps) {
  const [open, setOpen] = useState(false);
  const decideStatus = useDecideStatus();
  const queryClient = useQueryClient();
  const dismissDialog = useDismissDialog();

  const dialogTitle =
    decision === REVIEW_STATE.APPROVED
      ? "อนุมัติการเปลี่ยนสถานะ"
      : "ปฏิเสธการเปลี่ยนสถานะ";

  const confirmDescription =
    decision === REVIEW_STATE.APPROVED
      ? "ยืนยันการเปลี่ยนสถานะ สำหรับ:"
      : "ปฏิเสธการเปลี่ยนสถานะ สำหรับ:";

  const { data } = useItemDetailAPI(String(itemId), {
    enabled: open,
  });

  const form = useForm({
    defaultValues: {
      note: undefined,
      decision: decision,
    },
    resolver: zodResolver(reviewSchema),
  });

  const handleSubmit = () => {
    const values = form.getValues();
    const title = decision === REVIEW_STATE.APPROVED ? "อนุมัติ" : "ปฏิเสธ";
    decideStatus.mutate(
      {
        requestId: request_id,
        params: {
          decision: values.decision,
          note: values.note,
        },
      },
      {
        onSuccess() {
          toast.success(`${title}การแก้ไขสำเร็จ`);
          queryClient.invalidateQueries({
            queryKey: [CHANGE_STATUS_ENDPOINT],
            exact: false,
          });
          dismissDialog.dismiss();
        },
        onError(error) {
          toast.error(`${title}การแก้ไขไม่สำเร็จ`, {
            description: error.message,
          });
        },
      }
    );
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          {...buttonProps}
          className={cn(buttonProps?.className)}
          variant={decision === REVIEW_STATE.APPROVED ? "approve" : "reject"}
        >
          {decision === REVIEW_STATE.APPROVED ? <CheckIcon /> : <XIcon />}
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Form {...form}>
            <form className="space-y-6">
              <div
                className={cn(
                  "p-4 border rounded",
                  decision === REVIEW_STATE.APPROVED &&
                    "text-green-600 bg-green-100 border-green-300",
                  decision === REVIEW_STATE.REJECTED &&
                    "text-red-600 bg-red-100 border-red-300"
                )}
              >
                <p className="flex items-center gap-2">
                  {decision === REVIEW_STATE.APPROVED ? (
                    <CheckIcon className="size-4" />
                  ) : (
                    <XIcon className="size-4" />
                  )}{" "}
                  {confirmDescription}
                </p>
                <p>
                  {data?.data?.product_code} - {data?.data?.station}{" "}
                  {data?.data?.roll_number} ({data?.data?.status_code})
                </p>
              </div>
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ความคิดเห็นเพิ่มเติม (ไม่บังคับ)</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            disabled={decideStatus.isPending || !form.formState.isDirty}
            onClick={form.handleSubmit(handleSubmit)}
          >
            ยืนยัน
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
