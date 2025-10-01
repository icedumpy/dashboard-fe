import { useQuery } from "@tanstack/react-query";

import { CHANGE_STATUS_ENDPOINT } from "@/constants/api";
import { ChangeStatusService } from "@/services/change-status-service";
import { sanitizeQueryParams } from "@/utils/sanitize-query-params";

export const useGetChangeStatus = (params: unknown) =>
  useQuery({
    queryKey: [CHANGE_STATUS_ENDPOINT, sanitizeQueryParams(params)],
    queryFn: () => ChangeStatusService.getChangeStatus(params),
  });
