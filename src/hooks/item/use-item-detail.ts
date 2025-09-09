import { useQuery } from "@tanstack/react-query";

import { ITEM_ENDPOINT } from "@/contants/api";
import { ItemService } from "@/services/item-service";

export const useItemDetailAPI = (
  id?: string,
  options?: Record<string, unknown>
) =>
  useQuery({
    queryKey: [ITEM_ENDPOINT, id],
    queryFn: () => ItemService.getItemDetail(id),
    ...options,
  });
