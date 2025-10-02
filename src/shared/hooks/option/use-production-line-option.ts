import { useQuery } from "@tanstack/react-query";

import { PRODUCTION_LINE_ENDPOINT } from "@/shared/constants/api";
import { OptionService } from "@/shared/services/option-service";

export const useProductionLineOptions = () =>
  useQuery({
    queryKey: [PRODUCTION_LINE_ENDPOINT, "options"],
    queryFn: () => OptionService.getProductionLine(),
  });
