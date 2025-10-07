import { ITEM_STATUS_ENDPOINT } from "@/shared/constants/api";
import { ItemStatusService } from "@/shared/services/item-status-service";
import { ItemStatus } from "@/shared/types/item-status";
import { useQuery } from "@tanstack/react-query";

interface UseGetItemStatusResponse {
  data: ItemStatus[];
}

export const useGetItemStatusAPI = () =>
  useQuery<UseGetItemStatusResponse>({
    queryKey: [ITEM_STATUS_ENDPOINT],
    queryFn: ItemStatusService.getItemStatus,
  });
