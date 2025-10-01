import { useMutation } from "@tanstack/react-query";

import { ChangeStatusService } from "@/services/change-status-service";

import type { ReviewStateT } from "@/types/review";

export interface DecideStatusParams {
  decision: ReviewStateT;
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
