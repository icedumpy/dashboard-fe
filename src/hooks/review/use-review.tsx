import { REVIEW_ENDPOINT } from "@/contants/api";
import { ReviewService } from "@/services/review-service";
import { PaginationType } from "@/types/pagination";
import { ReviewT } from "@/types/review";
import { useQuery } from "@tanstack/react-query";

interface ReviewQueryResponse {
  data: ReviewT[];
  pagination: PaginationType;
}

export const useReviewAPI = (params: unknown) =>
  useQuery<ReviewQueryResponse>({
    queryKey: [REVIEW_ENDPOINT, params],
    queryFn: () => ReviewService.getReviews(params),
  });
