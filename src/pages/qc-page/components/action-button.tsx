import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";

import ViewDetailButton from "./view-detail-button";
import ApproveButton from "./approve-button";
import RejectButton from "./reject-button";

import { ITEM_ENDPOINT } from "@/contants/api";
import { useReviewDecisionAPI } from "@/hooks/review/use-review-decision";
import { REVIEW_DECISION } from "@/contants/review";
import useDismissDialog from "@/hooks/use-dismiss-dialog";

export default function ActionButton({ id }: { id: string }) {
  const reviewDecision = useReviewDecisionAPI();
  const queryClient = useQueryClient();
  const dismissDialog = useDismissDialog();

  const handleReview = useCallback(
    (decision: string, note?: string) => {
      reviewDecision.mutate(
        { reviewId: id, decision: decision, note: note ?? "" },
        {
          onSuccess() {
            toast.success("Review submitted successfully!");
            queryClient.invalidateQueries({
              queryKey: [ITEM_ENDPOINT],
              exact: false,
            });
            dismissDialog.dismiss();
          },
          onError() {
            toast.error("Failed to submit review. Please try again.");
          },
        }
      );
    },
    [id, reviewDecision, queryClient, dismissDialog]
  );

  return (
    <div className="flex gap-2">
      <ViewDetailButton id={id} />
      <ApproveButton
        id={id}
        isLoading={reviewDecision.isPending}
        onSubmit={(value) => handleReview(REVIEW_DECISION.APPROVED, value.note)}
      />
      <RejectButton
        id={id}
        isLoading={reviewDecision.isPending}
        onSubmit={(value) => handleReview(REVIEW_DECISION.REJECTED, value.note)}
      />
    </div>
  );
}
