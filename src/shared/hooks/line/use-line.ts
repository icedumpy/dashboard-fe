import { useQuery } from "@tanstack/react-query";

import { PRODUCTION_LINE_ENDPOINT } from "@/shared/constants/api";
import { LineService } from "@/shared/services/line-service";

import type { ProductionLineT } from "@/shared/types/production-line";

export interface LineResponse {
  data: ProductionLineT[];
}

export const useLineAPI = () =>
  useQuery<LineResponse>({
    queryKey: [PRODUCTION_LINE_ENDPOINT],
    queryFn: LineService.getProductionLine,
  });
