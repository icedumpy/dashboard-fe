import axiosInstance from "@/lib/axios-instance";
import {
  DEFECT_TYPE_ENDPOINT,
  PRODUCTION_LINE_ENDPOINT,
} from "@/shared/constants/api";

import type { ProductionLineT } from "@/shared/types/production-line";
import type { OptionT } from "@/shared/types/option";
import type { DefectT } from "@/shared/types/defect";

export const OptionService = {
  getProductionLine: async () => {
    const response = await axiosInstance.get(PRODUCTION_LINE_ENDPOINT);
    const options = (response?.data?.data as ProductionLineT[]).map((item) => ({
      value: String(item.id),
      label: item.name,
      meta: {
        code: item.code,
      },
    }));

    return options as OptionT[];
  },
  getDefectOption: async () => {
    const response = await axiosInstance.get(DEFECT_TYPE_ENDPOINT);
    const options = (response?.data?.data as DefectT[]).map((item) => ({
      value: String(item.id),
      label: item.name_th,
      meta: {
        code: item.code,
      },
    }));

    return options as OptionT[];
  },
};
