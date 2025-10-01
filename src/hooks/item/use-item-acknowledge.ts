import { useMutation } from "@tanstack/react-query";
import { ItemService } from "@/services/item-service";

export const useItemAcknowledge = () =>
  useMutation({
    mutationFn: ItemService.itemAcknowledge,
  });
