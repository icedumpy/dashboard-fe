import { useQuery } from "@tanstack/react-query";

import { PRODUCTION_LINE_ENDPOINT } from "@/constants/api";
import { OptionService } from "@/services/option-service";

export const useProductionLineOptions = () =>
  useQuery({
    queryKey: [PRODUCTION_LINE_ENDPOINT, "options"],
    queryFn: () => OptionService.getProductionLine(),
  });
