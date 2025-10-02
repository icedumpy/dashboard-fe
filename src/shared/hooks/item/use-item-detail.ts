import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { ITEM_ENDPOINT } from "@/shared/constants/api";
import { ItemService } from "@/shared/services/item-service";

import type { StationDetailResponse } from "@/shared/types/item";

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
