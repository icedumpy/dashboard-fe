import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { ITEM_ENDPOINT } from "@/contants/api";
import { ItemService } from "@/services/item-service";

import type { StationDetailResponse } from "@/types/station";

export const useItemDetailAPI = (
  id?: string,
  options?: Omit<
    UseQueryOptions<StationDetailResponse, Error>,
    "queryKey" | "queryFn"
  >
) =>
  useQuery({
    queryKey: [ITEM_ENDPOINT, id],
    queryFn: () => ItemService.getItemDetail(id),
    ...options,
  });
