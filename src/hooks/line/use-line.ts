import { useQuery } from "@tanstack/react-query";

import { PRODUCTION_LINE_ENDPOINT } from "@/contants/api";
import { LineService } from "@/services/line-service";

import type { ProductionLineT } from "@/types/line";

interface LineResponse {
  data: ProductionLineT[];
}

export const useLineAPI = () =>
  useQuery<LineResponse>({
    queryKey: [PRODUCTION_LINE_ENDPOINT],
    queryFn: LineService.getProductionLine,
  });
