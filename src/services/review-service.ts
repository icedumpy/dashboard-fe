import { REVIEW_DECISION_ENDPOINT, REVIEW_ENDPOINT } from "@/constants/api";
import axiosInstance from "@/lib/axios-instance";

import type { ReviewDecisionParams } from "@/hooks/review/use-review-decision";

export const ReviewService = {
  getReviews: async (params: unknown) => {
    const response = await axiosInstance.get(REVIEW_ENDPOINT, { params });
    return response.data;
  },
  reviewDecision: async (params: ReviewDecisionParams) => {
    const response = await axiosInstance.post(
      REVIEW_DECISION_ENDPOINT.replace("{review_id}", params.reviewId),
      { decision: params.decision, note: params.note }
    );
    return response.data;
  },
};
