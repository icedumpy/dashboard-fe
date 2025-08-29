import { useQuery } from "@tanstack/react-query";

import { DEFECT_TYPE_ENDPOINT } from "@/contants/api";
import { OptionService } from "@/services/option-service";

export const useDefectOptionAPI = () =>
  useQuery({
    queryKey: [DEFECT_TYPE_ENDPOINT],
    queryFn: OptionService.getDefectOption,
  });
