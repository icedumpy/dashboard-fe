import { useMutation } from "@tanstack/react-query";

import { ItemService } from "@/shared/services/item-service";
import { ITEM_FIX_REQUEST_ENDPOINT } from "@/shared/constants/api";

export const useItemFixRequest = () => {
  const mutation = useMutation({
    mutationKey: [ITEM_FIX_REQUEST_ENDPOINT],
    mutationFn: ItemService.itemFixRequest,
  });

  return mutation;
};
