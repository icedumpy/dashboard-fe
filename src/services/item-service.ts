import { ITEM, ITEM_SUMMARY } from "@/contants/item";
import axiosInstance from "@/lib/axios-instance";

import type { StationDetailResponse, StationResponse } from "@/types/station";
import type { ItemSummaryResponse } from "@/types/item";

export const ItemService = {
  getItemSummary: async () => {
    const response = await axiosInstance.get(ITEM_SUMMARY);
    return response.data as ItemSummaryResponse;
  },
  getItems: async (params: unknown) => {
    const response = await axiosInstance.get(ITEM, { params });
    return response.data as StationResponse;
  },
  getItemDetail: async (id?: string) => {
    const response = await axiosInstance.get(`${ITEM}/${id}`);
    return response.data as StationDetailResponse;
  },
};
