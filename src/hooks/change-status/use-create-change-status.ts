import { useMutation } from "@tanstack/react-query";

import { ChangeStatusService } from "@/services/change-status-service";

export interface ChangeStatusParams {
  item_id: number;
  to_status_id: number;
  reason: string;
  meta?: unknown;
  defect_type_ids: number[];
}

export const useChangeStatus = () =>
  useMutation({
    mutationFn: (data: ChangeStatusParams) =>
      ChangeStatusService.postChangeStatus(data),
  });
