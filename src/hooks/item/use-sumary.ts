import { useQuery } from "@tanstack/react-query";

import { ITEM_SUMMARY_ENDPOINT } from "@/contants/api";
import { ItemService } from "@/services/item-service";

export const useItemSummaryAPI = () =>
  useQuery({
    queryKey: [ITEM_SUMMARY_ENDPOINT],
    queryFn: () => ItemService.getItemSummary(),
  });
