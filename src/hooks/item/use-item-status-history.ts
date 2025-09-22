import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { ITEM_STATUS_HISTORY_ENDPOINT } from "@/contants/api";
import { ItemService } from "@/services/item-service";

import type { ItemStatusHistoryT } from "@/types/station";

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
