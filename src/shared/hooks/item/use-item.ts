import { useQuery } from "@tanstack/react-query";

import { ITEM_ENDPOINT } from "@/shared/constants/api";
import { ItemService } from "@/shared/services/item-service";
import { sanitizeQueryParams } from "@/shared/utils/sanitize-query-params";

import type { FilterType } from "@/features/operator/types";
import type { OrderBy } from "@/shared/types/order";

export const useItemAPI = (
  params: FilterType & { sort_by?: string; order_by?: OrderBy }
) =>
  useQuery({
    queryKey: [ITEM_ENDPOINT, sanitizeQueryParams(params)],
    queryFn: () => ItemService.getItems(sanitizeQueryParams(params)),
    refetchInterval: 60 * 1000, // 1 minute
  });
