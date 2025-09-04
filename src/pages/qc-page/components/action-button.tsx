import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";

import ApproveButton from "./approve-button";
import RejectButton from "./reject-button";
import ViewDetailButton from "./view-detail-button";

import { REVIEW_ENDPOINT } from "@/contants/api";
import { REVIEW_STATE } from "@/contants/review";
import { useReviewDecisionAPI } from "@/hooks/review/use-review-decision";
import useDismissDialog from "@/hooks/use-dismiss-dialog";

export default function ActionButton({
  item_id,
  review_id,
}: {
  item_id: string;
  review_id: string;
}) {
  const reviewDecision = useReviewDecisionAPI();
  const queryClient = useQueryClient();
  const dismissDialog = useDismissDialog();

  const handleReview = useCallback(
    (decision: string, note?: string) => {
      reviewDecision.mutate(
        { reviewId: review_id, decision: decision, note: note ?? "" },
        {
          onSuccess() {
            toast.success("อนุมัติการแก้ไขสำเร็จ");
            queryClient.invalidateQueries({
              queryKey: [REVIEW_ENDPOINT],
              exact: false,
            });
            dismissDialog.dismiss();
          },
          onError(error) {
            toast.error("อนุมัติการแก้ไขไม่สำเร็จ", {
              description: error.message,
            });
          },
        }
      );
    },
    [reviewDecision, review_id, queryClient, dismissDialog]
  );

  return (
    <div className="flex gap-2">
      <ViewDetailButton id={item_id} />
      <ApproveButton
        id={item_id}
        isLoading={reviewDecision.isPending}
        onSubmit={(value) => handleReview(REVIEW_STATE.APPROVED, value.note)}
      />
      <RejectButton
        id={item_id}
        isLoading={reviewDecision.isPending}
        onSubmit={(value) => handleReview(REVIEW_STATE.REJECTED, value.note)}
      />
    </div>
  );
}
