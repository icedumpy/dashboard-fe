import {
  ITEM_ENDPOINT,
  ITEM_FIX_REQUEST_ENDPOINT,
  ITEM_REPORT_ENDPOINT,
  ITEM_SCRAP_ENDPOINT,
  ITEM_STATUS_UPDATE_ENDPOINT,
} from "@/contants/api";
import { ItemStatusUpdateParams } from "@/hooks/item/use-item-status-update";
import axiosInstance from "@/lib/axios-instance";
import { formatDetectedRange } from "@/lib/utils";

import type { FilterType } from "@/pages/operator-page/types";
import type { StationDetailResponse, StationResponse } from "@/types/station";

export const ItemService = {
  getItems: async (params: FilterType) => {
    const response = await axiosInstance.get(ITEM_ENDPOINT, {
      params: {
        ...params,
        ...formatDetectedRange(params.detected_from, params.detected_to),
      },
    });
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
  itemStateUpdate: async (itemId: string, params: ItemStatusUpdateParams) => {
    const response = await axiosInstance.patch(
      ITEM_STATUS_UPDATE_ENDPOINT.replace("{item_id}", itemId),
      {
        status: params.status,
        defect_type_ids: params.defect_type_ids ?? [],
      }
    );
    return response.data;
  },
};
