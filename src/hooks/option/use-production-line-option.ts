import { useQuery } from "@tanstack/react-query";

import { GET_PRODUCTION_LINE_OPTIONS } from "@/contants/line";
import { OptionService } from "@/services/option-service";

export const useProductionLineOptions = () =>
  useQuery({
    queryKey: [GET_PRODUCTION_LINE_OPTIONS],
    queryFn: () => OptionService.getProductionLine(),
  });
