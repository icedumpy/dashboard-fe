import { useQuery } from "@tanstack/react-query";

import { DEFECT_TYPE_ENDPOINT } from "@/shared/constants/api";
import { OptionService } from "@/shared/services/option-service";

export const useDefectOptionAPI = () =>
  useQuery({
    queryKey: [DEFECT_TYPE_ENDPOINT],
    queryFn: OptionService.getDefectOption,
  });
