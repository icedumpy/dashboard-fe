import { ITEM_STATUS_HISTORY_ENDPOINT } from "@/contants/api";
import { ItemService } from "@/services/item-service";
import { ItemStatusHistoryT } from "@/types/station";
import { useQuery } from "@tanstack/react-query";
import { UseQueryOptions } from "@tanstack/react-query";

export type ItemStatusHistoryResponse = ItemStatusHistoryT;

export const useItemStatusHistory = (
  itemId?: string,
  options?: Omit<
    UseQueryOptions<ItemStatusHistoryResponse[], Error>,
    "queryKey" | "queryFn"
  >
) =>
  useQuery<ItemStatusHistoryResponse[], Error>({
    queryKey: [ITEM_STATUS_HISTORY_ENDPOINT, itemId],
    queryFn: () => ItemService.itemStatusHistory(itemId),
    ...options,
  });
