import { useQueryState } from "nuqs";

import ViewDetailButton from "./view-detail-button";
import ReviewDecisionButton from "@/components/review-decision-button";

import { REVIEW_STATE } from "@/contants/review";
import { TABS, TABS_KEYS } from "../constants/tabs";

export default function ActionButton({
  itemId,
  reviewId,
}: {
  itemId: string;
  reviewId: string;
}) {
  const [tabs] = useQueryState("tabs", {
    defaultValue: TABS[0].value,
  });

  return (
    <div className="flex gap-2">
      <ViewDetailButton itemId={itemId} reviewId={reviewId} />
      {tabs === TABS_KEYS.WAITING_FOR_REVIEW && (
        <>
          <ReviewDecisionButton
            buttonProps={{
              className: "size-8",
            }}
            itemId={itemId}
            reviewId={reviewId}
            decision={REVIEW_STATE.APPROVED}
          />
          <ReviewDecisionButton
            buttonProps={{
              className: "size-8",
            }}
            itemId={itemId}
            reviewId={reviewId}
            decision={REVIEW_STATE.REJECTED}
          />
        </>
      )}
    </div>
  );
}
