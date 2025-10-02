import { useMutation } from "@tanstack/react-query";

import { ChangeStatusService } from "@/shared/services/change-status-service";

export interface ChangeStatusParams {
  item_id: number;
  to_status_id: number;
  reason: string;
  defect_type_ids?: number[];
  meta?: unknown;
}

export const useChangeStatus = () =>
  useMutation({
    mutationFn: (data: ChangeStatusParams) =>
      ChangeStatusService.postChangeStatus(data),
  });
