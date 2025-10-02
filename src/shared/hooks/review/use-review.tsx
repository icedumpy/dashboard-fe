import { useQuery } from "@tanstack/react-query";

import { REVIEW_ENDPOINT } from "@/shared/constants/api";
import { ReviewService } from "@/shared/services/review-service";
import { sanitizeQueryParams } from "@/shared/utils/sanitize-query-params";

import type { Pagination } from "@/shared/types/pagination";
import type {
  ReviewStateT,
  ReviewSummaryT,
  ReviewT,
} from "@/shared/types/review";
import type { OrderBy } from "@/shared/types/order";

interface ReviewQueryResponse {
  data: ReviewT[];
  summary?: ReviewSummaryT;
  pagination: Pagination;
}

interface ReviewParams {
  page?: number;
  page_size?: number;
  line_id: string;
  review_state?: ReviewStateT[];
  defect_type_id?: string;
  sort_by?: string;
  order_by?: OrderBy;
}

export const useReviewAPI = (params: ReviewParams) =>
  useQuery<ReviewQueryResponse>({
    queryKey: [REVIEW_ENDPOINT, sanitizeQueryParams(params)],
    queryFn: () => ReviewService.getReviews(sanitizeQueryParams(params)),
    refetchInterval: 60 * 1000,
  });
