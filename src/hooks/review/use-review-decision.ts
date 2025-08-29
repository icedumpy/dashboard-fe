import { REVIEW_DECISION_ENDPOINT } from "@/contants/api";
import { ReviewService } from "@/services/review-service";
import { useMutation } from "@tanstack/react-query";

export interface ReviewDecisionParams {
  reviewId: string;
  decision: string;
  note: string;
}

export const useReviewDecisionAPI = () =>
  useMutation({
    mutationKey: [REVIEW_DECISION_ENDPOINT],
    mutationFn: (params: ReviewDecisionParams) =>
      ReviewService.reviewDecision(params),
  });
