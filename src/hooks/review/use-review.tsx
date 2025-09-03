import { useQuery } from "@tanstack/react-query";

import { REVIEW_ENDPOINT } from "@/contants/api";
import { ReviewService } from "@/services/review-service";
import { sanitizeQueryParams } from "@/utils/sanitize-query-params";
import { REVIEW_STATE } from "@/contants/review";

import type { PaginationType } from "@/types/pagination";
import type { ReviewT } from "@/types/review";

interface ReviewQueryResponse {
  data: ReviewT[];
  pagination: PaginationType;
}

interface ReviewParams {
  page?: number;
  page_size?: number;
  line_id: string;
  review_state?: (typeof REVIEW_STATE)[keyof typeof REVIEW_STATE];
  defect_type_id?: string;
}

export const useReviewAPI = (params: ReviewParams) =>
  useQuery<ReviewQueryResponse>({
    queryKey: [REVIEW_ENDPOINT, params],
    queryFn: () => ReviewService.getReviews(sanitizeQueryParams(params)),
  });
