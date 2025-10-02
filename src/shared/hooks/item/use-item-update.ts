import { useMutation } from "@tanstack/react-query";

import { ItemService } from "@/shared/services/item-service";

import type { UpdateItemDetail } from "@/features/operator/types";

export interface ItemUpdateParams extends UpdateItemDetail {
  itemId: string;
}
export const useItemUpdate = () =>
  useMutation({
    mutationFn: (params: ItemUpdateParams) => ItemService.itemUpdate(params),
  });
