import { useMutation } from "@tanstack/react-query";

import { ITEM_SCRAP_ENDPOINT } from "@/shared/constants/api";
import { ItemService } from "@/shared/services/item-service";

export const useItemScrapAPI = () =>
  useMutation({
    mutationKey: [ITEM_SCRAP_ENDPOINT],
    mutationFn: ItemService.itemScrap,
  });
