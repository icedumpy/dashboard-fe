import { useQuery } from "@tanstack/react-query";

import { ITEM_ENDPOINT } from "@/contants/api";
import { ItemService } from "@/services/item-service";

export const useItemAPI = (params: unknown) =>
  useQuery({
    queryKey: [ITEM_ENDPOINT],
    queryFn: () => ItemService.getItems(params),
  });
