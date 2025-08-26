import { ITEM } from "@/contants/item";
import axiosInstance from "@/lib/axios-instance";

import type { StationResponse } from "@/types/station";

export const ItemService = {
  getItems: async (params: unknown) => {
    const response = await axiosInstance.get(ITEM, { params });
    return response.data as StationResponse;
  },
};
