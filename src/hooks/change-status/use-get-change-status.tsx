import { useQuery } from "@tanstack/react-query";

import { CHANGE_STATUS_ENDPOINT } from "@/contants/api";
import { ChangeStatusService } from "@/services/change-status-service";

export const useGetChangeStatus = (params: unknown) =>
  useQuery({
    queryKey: [CHANGE_STATUS_ENDPOINT, params],
    queryFn: () => ChangeStatusService.getChangeStatus(params),
  });
