import { useMutation } from "@tanstack/react-query";
import { ItemService } from "@/shared/services/item-service";

export const useItemAcknowledge = () =>
  useMutation({
    mutationFn: ItemService.itemAcknowledge,
  });
