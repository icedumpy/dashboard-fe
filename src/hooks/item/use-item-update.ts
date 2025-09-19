import { useMutation } from "@tanstack/react-query";

import { ItemService } from "@/services/item-service";

import type { UpdateItemDetail } from "@/pages/operator-page/types";

export interface ItemUpdateParams extends UpdateItemDetail {
  itemId: string;
}
export const useItemUpdate = () =>
  useMutation({
    mutationFn: (params: ItemUpdateParams) => ItemService.itemUpdate(params),
  });
