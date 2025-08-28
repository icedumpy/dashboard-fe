import {
  ITEM_ENDPOINT,
  ITEM_REPORT_ENDPOINT,
  ITEM_SUMMARY_ENDPOINT,
} from "@/contants/api";
import axiosInstance from "@/lib/axios-instance";

import type { StationDetailResponse, StationResponse } from "@/types/station";
import type { ItemSummaryResponse } from "@/types/item";

export const ItemService = {
  getItemSummary: async () => {
    const response = await axiosInstance.get(ITEM_SUMMARY_ENDPOINT);
    return response.data as ItemSummaryResponse;
  },
  getItems: async (params: unknown) => {
    const response = await axiosInstance.get(ITEM_ENDPOINT, { params });
    return response.data as StationResponse;
  },
  getItemDetail: async (id?: string) => {
    const response = await axiosInstance.get(`${ITEM_ENDPOINT}/${id}`);
    return response.data as StationDetailResponse;
  },
  itemReport: async (params: unknown) => {
    const response = await axiosInstance.post(ITEM_REPORT_ENDPOINT, params, {
      responseType: "blob",
    });
    return response?.data;
  },
};
