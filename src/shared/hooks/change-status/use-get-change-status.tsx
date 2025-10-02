import { useQuery } from "@tanstack/react-query";

import { CHANGE_STATUS_ENDPOINT } from "@/shared/constants/api";
import { ChangeStatusService } from "@/shared/services/change-status-service";
import { sanitizeQueryParams } from "@/shared/utils/sanitize-query-params";

export const useGetChangeStatus = (params: unknown) =>
  useQuery({
    queryKey: [CHANGE_STATUS_ENDPOINT, sanitizeQueryParams(params)],
    queryFn: () => ChangeStatusService.getChangeStatus(params),
  });
