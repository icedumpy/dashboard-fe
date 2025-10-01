import {
  CHANGE_STATUS_ENDPOINT,
  DECIDE_STATUS_ENDPOINT,
} from "@/constants/api";
import { ChangeStatusParams } from "@/hooks/change-status/use-create-change-status";
import { DecideStatusParams } from "@/hooks/change-status/use-decide-status";
import axiosInstance from "@/lib/axios-instance";

import type { ChangeStatusSummary, ChangeStatusT } from "@/types/change-status";
import type { PaginationType } from "@/types/pagination";

interface ChangeStatusResponse {
  data: ChangeStatusT[];
  pagination: PaginationType;
  summary: ChangeStatusSummary;
}

export const ChangeStatusService = {
  getChangeStatus: async (params: unknown) => {
    const response = await axiosInstance.get(CHANGE_STATUS_ENDPOINT, {
      params,
    });
    return response.data as ChangeStatusResponse;
  },
  postChangeStatus: async (params: ChangeStatusParams) => {
    const response = await axiosInstance.post(CHANGE_STATUS_ENDPOINT, params);
    return response.data;
  },
  patchChangeStatus: async (
    requestId: number,
    params: Partial<DecideStatusParams>
  ) => {
    const response = await axiosInstance.patch(
      `${DECIDE_STATUS_ENDPOINT.replace("{request_id}", String(requestId))}`,
      params
    );
    return response.data;
  },
};
