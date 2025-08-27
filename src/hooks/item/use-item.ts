import { useQuery } from "@tanstack/react-query";

import { ITEM } from "@/contants/item";
import { ItemService } from "@/services/item-service";
import { sanitizeQueryParams } from "@/utils/sanitize-query-params";

import type { FilterType } from "@/pages/operator-page/types";

export const useItemAPI = (params: FilterType) =>
  useQuery({
    queryKey: [ITEM, sanitizeQueryParams(params)],
    queryFn: () => ItemService.getItems(sanitizeQueryParams(params)),
  });
