import { useMutation } from "@tanstack/react-query";

import { ChangeStatusService } from "@/shared/services/change-status-service";

export interface DecideStatusParams {
  decision: string;
  note: string;
}

export interface DecideStatusMutationVariables {
  requestId: number;
  params: Partial<DecideStatusParams>;
}

export const useDecideStatus = () =>
  useMutation({
    mutationFn: ({ requestId, params }: DecideStatusMutationVariables) =>
      ChangeStatusService.patchChangeStatus(requestId, params),
  });
