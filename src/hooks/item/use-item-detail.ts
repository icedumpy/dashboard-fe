import { useQuery } from "@tanstack/react-query";

import { ITEM } from "@/contants/item";
import { ItemService } from "@/services/item-service";

export const useItemDetailAPI = (
  id?: string,
  options?: Record<string, unknown>
) =>
  useQuery({
    queryKey: [ITEM, id],
    queryFn: () => ItemService.getItemDetail(id),
    enabled: !!id,
    ...options,
  });
