import { REVIEW_DECISION_ENDPOINT } from "@/shared/constants/api";
import { ReviewService } from "@/shared/services/review-service";
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
