import { useQueryClient } from "@tanstack/react-query";
import { CheckIcon, XIcon } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { ITEM_ENDPOINT } from "@/contants/api";
import { useReviewDecisionAPI } from "@/hooks/review/use-review-decision";
import ViewDetailButton from "./view-detail-button";

export default function ActionButton({ id }: { id: string }) {
  const reviewDecision = useReviewDecisionAPI();
  const queryClient = useQueryClient();

  const handleReview = useCallback(
    (decision: string) => {
      reviewDecision.mutate(
        { reviewId: id, decision: decision, note: "" },
        {
          onSuccess() {
            toast.success("Review submitted successfully!");
            queryClient.invalidateQueries({
              queryKey: [ITEM_ENDPOINT],
              exact: false,
            });
          },
          onError() {
            toast.error("Failed to submit review. Please try again.");
          },
        }
      );
    },
    [id, reviewDecision, queryClient]
  );

  return (
    <div className="flex gap-2">
      <ViewDetailButton id={id} />
      <Button
        className="text-green-600 size-8"
        variant="secondary"
        onClick={() => handleReview("APPROVED")}
        disabled={reviewDecision.isPending}
      >
        <CheckIcon />
      </Button>
      <Button
        className="text-orange-600 size-8"
        variant="secondary"
        onClick={() => handleReview("REJECTED")}
        disabled={reviewDecision.isPending}
      >
        <XIcon />
      </Button>
    </div>
  );
}
