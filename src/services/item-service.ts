import {
  ITEM_ACKNOWLEDGE_ENDPOINT,
  ITEM_ENDPOINT,
  ITEM_FIX_REQUEST_ENDPOINT,
  ITEM_REPORT_ENDPOINT,
  ITEM_SCRAP_ENDPOINT,
  ITEM_STATUS_HISTORY_ENDPOINT,
} from "@/constants/api";
import { ItemUpdateParams } from "@/hooks/item/use-item-update";
import axiosInstance from "@/lib/axios-instance";

import type { FilterType } from "@/pages/operator-page/types";
import type { StationDetailResponse, ItemResponse } from "@/types/item";

export const ItemService = {
  getItems: async (params: FilterType) => {
    const response = await axiosInstance.get(ITEM_ENDPOINT, {
      params,
    });
    return response.data as ItemResponse;
  },
  getItemDetail: async (id?: string) => {
    const response = await axiosInstance.get(`${ITEM_ENDPOINT}/${id}`);
    return response.data as StationDetailResponse;
  },
  itemReport: async (params: FilterType) => {
    const response = await axiosInstance.post(ITEM_REPORT_ENDPOINT, params, {
      responseType: "blob",
    });
    return response?.data;
  },
  itemFixRequest: async (params: {
    itemId: string;
    image_ids: number[];
    kinds: string;
  }) => {
    const response = await axiosInstance.post(
      ITEM_FIX_REQUEST_ENDPOINT.replace("{itemId}", params.itemId),
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
  itemStatusHistory: async (itemId?: string) => {
    const response = await axiosInstance.get(
      ITEM_STATUS_HISTORY_ENDPOINT.replace("{item_id}", String(itemId))
    );
    return response.data;
  },
  itemUpdate: async (params: ItemUpdateParams) => {
    const response = await axiosInstance.patch(
      `${ITEM_ENDPOINT}/${params.itemId}`,
      {
        product_code: params.product_code,
        roll_number: params.roll_number,
        bundle_number: params.bundle_number,
        job_order_number: params.job_order_number,
        roll_width: params.roll_width,
        roll_id: params.roll_id,
      }
    );
    return response.data;
  },
  itemAcknowledge: async (itemId: string) => {
    const response = await axiosInstance.post(
      ITEM_ACKNOWLEDGE_ENDPOINT.replace("{item_id}", itemId)
    );
    return response.data;
  },
};
