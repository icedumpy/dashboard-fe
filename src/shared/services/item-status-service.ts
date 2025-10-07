import axiosInstance from "@/lib/axios-instance";
import { ITEM_STATUS_ENDPOINT } from "../constants/api";

export const ItemStatusService = {
  getItemStatus: async () => {
    const response = await axiosInstance.get(ITEM_STATUS_ENDPOINT);
    return response?.data;
  },
};
