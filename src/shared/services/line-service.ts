import { PRODUCTION_LINE_ENDPOINT } from "@/shared/constants/api";
import axiosInstance from "@/lib/axios-instance";

export const LineService = {
  getProductionLine: async () => {
    const response = await axiosInstance.get(PRODUCTION_LINE_ENDPOINT);
    return response?.data;
  },
};
