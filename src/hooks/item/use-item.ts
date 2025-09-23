import { useQuery } from "@tanstack/react-query";

import { ITEM_ENDPOINT } from "@/constants/api";
import { ItemService } from "@/services/item-service";
import { sanitizeQueryParams } from "@/utils/sanitize-query-params";

import type { FilterType } from "@/pages/operator-page/types";
import type { OrderBy } from "@/types/order";

export const useItemAPI = (
  params: FilterType & { sort_by?: string; order_by: OrderBy }
) =>
  useQuery({
    queryKey: [ITEM_ENDPOINT, sanitizeQueryParams(params)],
    queryFn: () => ItemService.getItems(sanitizeQueryParams(params)),
    refetchInterval: 60 * 1000, // 1 minute
  });
