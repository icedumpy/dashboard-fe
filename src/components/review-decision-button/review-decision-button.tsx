import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckIcon, XIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Dialog,
  DialogClose,
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
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useReviewDecisionAPI } from "@/hooks/review/use-review-decision";
import { useItemDetailAPI } from "@/hooks/item/use-item-detail";
import useDismissDialog from "@/hooks/use-dismiss-dialog";
import { REVIEW_STATE } from "@/constants/review";
import { REVIEW_ENDPOINT } from "@/constants/api";
import { cn } from "@/lib/utils";
import { reviewSchema } from "./schema";

import type { ReviewDecisionButtonProps } from "./types";

export default function ReviewDecisionButton({
  itemId,
  reviewId,
  decision,
  buttonProps,
}: ReviewDecisionButtonProps) {
  const [open, setOpen] = useState(false);
  const reviewDecision = useReviewDecisionAPI();
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

  const form = useForm({
    defaultValues: {
      note: undefined,
      decision: decision,
    },
    resolver: zodResolver(reviewSchema),
  });

  const { data } = useItemDetailAPI(itemId, {
    enabled: open,
  });

  const handleSubmit = () => {
    const values = form.getValues();
    const title = decision === REVIEW_STATE.APPROVED ? "อนุมัติ" : "ปฏิเสธ";
    reviewDecision.mutate(
      { reviewId: reviewId, decision: decision, note: values.note ?? "" },
      {
        onSuccess() {
          toast.success(`${title}การแก้ไขสำเร็จ`);
          queryClient.invalidateQueries({
            queryKey: [REVIEW_ENDPOINT],
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
          <DialogClose asChild>
            <Button variant="outline" type="button">
              ยกเลิก
            </Button>
          </DialogClose>
          <Button
            disabled={reviewDecision.isPending || !form.formState.isValid}
            onClick={form.handleSubmit(handleSubmit)}
          >
            ยืนยัน
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
