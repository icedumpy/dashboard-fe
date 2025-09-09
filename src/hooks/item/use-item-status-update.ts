import { ITEM_STATUS_UPDATE_ENDPOINT } from "@/contants/api";
import { ItemService } from "@/services/item-service";
import { useMutation } from "@tanstack/react-query";

export interface ItemStatusUpdateParams {
  status: string;
  defect_type_ids?: string[];
}

export const useItemStatusUpdate = () =>
  useMutation({
    mutationKey: [ITEM_STATUS_UPDATE_ENDPOINT],
    mutationFn: async (params: ItemStatusUpdateParams & { itemId: string }) =>
      await ItemService.itemStateUpdate(params.itemId, params),
  });
