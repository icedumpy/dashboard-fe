import { DASHBOARD_SUMMARY_ENDPOINT } from "@/constants/api";
import { SummaryParams } from "@/hooks/dashboard/use-summary";
import axiosInstance from "@/lib/axios-instance";

export const DashboardService = {
  getSummary: async (params: SummaryParams) => {
    const response = await axiosInstance.get(DASHBOARD_SUMMARY_ENDPOINT, {
      params,
    });
    return response.data;
  },
};
