import { useQuery } from "@tanstack/react-query";

import { ITEM_SUMMARY } from "@/contants/item";
import { ItemService } from "@/services/item-service";

export const useItemSummaryAPI = () =>
  useQuery({
    queryKey: [ITEM_SUMMARY],
    queryFn: () => ItemService.getItemSummary(),
  });
