import { useMutation } from "@tanstack/react-query";

import { ITEM_SCRAP_ENDPOINT } from "@/constants/api";
import { ItemService } from "@/services/item-service";

export const useItemScrapAPI = () =>
  useMutation({
    mutationKey: [ITEM_SCRAP_ENDPOINT],
    mutationFn: ItemService.itemScrap,
  });
