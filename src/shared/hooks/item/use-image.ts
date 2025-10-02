import { useQuery } from "@tanstack/react-query";

import { ITEM_ENDPOINT } from "@/shared/constants/api";
import { ItemService } from "@/shared/services/item-service";

import type { FilterType } from "@/features/operator/types";

export const useItemAPI = (params: FilterType) =>
  useQuery({
    queryKey: [ITEM_ENDPOINT],
    queryFn: () => ItemService.getItems(params),
  });
