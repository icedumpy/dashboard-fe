import { ITEM } from "@/contants/item";
import { ItemService } from "@/services/item-service";
import { useQuery } from "@tanstack/react-query";

export const useItemAPI = (params: unknown) =>
  useQuery({
    queryKey: [ITEM],
    queryFn: () => ItemService.getItems(params),
  });
