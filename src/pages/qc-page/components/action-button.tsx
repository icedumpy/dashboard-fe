import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";
import { useQueryState } from "nuqs";

import ApproveButton from "./approve-button";
import RejectButton from "./reject-button";
import ViewDetailButton from "./view-detail-button";

import useDismissDialog from "@/hooks/use-dismiss-dialog";
import { REVIEW_ENDPOINT } from "@/contants/api";
import { REVIEW_STATE } from "@/contants/review";
import { useReviewDecisionAPI } from "@/hooks/review/use-review-decision";
import { TABS } from "../constants/tabs";

export default function ActionButton({
  item_id,
  review_id,
}: {
  item_id: string;
  review_id: string;
}) {
  const [tabs] = useQueryState("tabs", {
    defaultValue: TABS[0].value,
  });
  const reviewDecision = useReviewDecisionAPI();
  const queryClient = useQueryClient();
  const dismissDialog = useDismissDialog();

  const handleReview = useCallback(
    (decision: string, note?: string) => {
      const title =
        decision === REVIEW_STATE.APPROVED ? "อนุมัติ" : "ไม่อนุมัติ";
      reviewDecision.mutate(
        { reviewId: review_id, decision: decision, note: note ?? "" },
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
    },
    [reviewDecision, review_id, queryClient, dismissDialog]
  );

  return (
    <div className="flex gap-2">
      <ViewDetailButton itemId={item_id} />
      {tabs === TABS[0].value && (
        <>
          <ApproveButton
            id={item_id}
            isLoading={reviewDecision.isPending}
            onSubmit={(value) =>
              handleReview(REVIEW_STATE.APPROVED, value.note)
            }
          />
          <RejectButton
            id={item_id}
            isLoading={reviewDecision.isPending}
            onSubmit={(value) =>
              handleReview(REVIEW_STATE.REJECTED, value.note)
            }
          />
        </>
      )}
    </div>
  );
}
