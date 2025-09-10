import { useQuery } from "@tanstack/react-query";

import { ITEM_ENDPOINT } from "@/contants/api";
import { ItemService } from "@/services/item-service";
import { sanitizeQueryParams } from "@/utils/sanitize-query-params";

import type { FilterType } from "@/pages/operator-page/types";

export const useItemAPI = (params: FilterType) =>
  useQuery({
    queryKey: [ITEM_ENDPOINT, sanitizeQueryParams(params)],
    queryFn: () => ItemService.getItems(sanitizeQueryParams(params)),
    refetchInterval: 60 * 1000, // 1 minute
  });
