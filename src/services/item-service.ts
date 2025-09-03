import {
  ITEM_ENDPOINT,
  ITEM_FIX_REQUEST_ENDPOINT,
  ITEM_REPORT_ENDPOINT,
  ITEM_SCRAP_ENDPOINT,
} from "@/contants/api";
import axiosInstance from "@/lib/axios-instance";

import type { StationDetailResponse, StationResponse } from "@/types/station";

export const ItemService = {
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
  itemFixRequest: async (params: {
    item_data: string;
    image_ids: number[];
    kinds: string;
  }) => {
    const response = await axiosInstance.post(
      ITEM_FIX_REQUEST_ENDPOINT.replace("{item_data}", params.item_data),
      {
        image_ids: params.image_ids,
        kinds: params.kinds,
      }
    );
    return response.data;
  },
  itemScrap: async (item_id: string) => {
    const response = await axiosInstance.post(
      ITEM_SCRAP_ENDPOINT.replace("{item_id}", item_id)
    );
    return response.data;
  },
};
