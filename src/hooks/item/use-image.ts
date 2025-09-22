import { useQuery } from "@tanstack/react-query";

import { ITEM_ENDPOINT } from "@/contants/api";
import { ItemService } from "@/services/item-service";

import type { FilterType } from "@/pages/operator-page/types";

export const useItemAPI = (params: FilterType) =>
  useQuery({
    queryKey: [ITEM_ENDPOINT],
    queryFn: () => ItemService.getItems(params),
  });
