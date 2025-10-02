import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { ITEM_STATUS_HISTORY_ENDPOINT } from "@/shared/constants/api";
import { ItemService } from "@/shared/services/item-service";

import type { ItemStatusHistoryT } from "@/shared/types/item";

export type ItemStatusHistoryResponse = ItemStatusHistoryT[];

export const useItemStatusHistory = (
  itemId?: string,
  options?: Omit<
    UseQueryOptions<ItemStatusHistoryResponse, Error>,
    "queryKey" | "queryFn"
  >
) =>
  useQuery({
    queryKey: [ITEM_STATUS_HISTORY_ENDPOINT, itemId],
    queryFn: () => ItemService.itemStatusHistory(itemId),
    ...options,
  });
