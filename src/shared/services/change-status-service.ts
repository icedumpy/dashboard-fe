import axiosInstance from '@/lib/axios-instance';
import {
  CHANGE_STATUS_ENDPOINT,
  DECIDE_STATUS_ENDPOINT,
} from '@/shared/constants/api';
import { ChangeStatusParams } from '@/shared/hooks/change-status/use-create-change-status';
import { DecideStatusParams } from '@/shared/hooks/change-status/use-decide-status';

import type {
  ChangeStatusSummary,
  ChangeStatusT,
} from '@/shared/types/change-status';
import type { Pagination } from '@/shared/types/pagination';

interface ChangeStatusResponse {
  data: ChangeStatusT[];
  pagination: Pagination;
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
    params: Partial<DecideStatusParams>,
  ) => {
    const response = await axiosInstance.patch(
      `${DECIDE_STATUS_ENDPOINT.replace('{request_id}', String(requestId))}`,
      params,
    );
    return response.data;
  },
};
