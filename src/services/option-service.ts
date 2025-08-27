import axiosInstance from "@/lib/axios-instance";
import { PRODUCTION_LINE_ENDPOINT } from "@/contants/api";

import type { ProductionLineT } from "@/types/line";
import type { OptionT } from "@/types/option";

export const OptionService = {
  getProductionLine: async () => {
    const response = await axiosInstance.get(PRODUCTION_LINE_ENDPOINT);

    const options = (response?.data?.data as ProductionLineT[]).map((item) => ({
      value: item.code,
      label: item.name,
    }));

    return options as OptionT[];
  },
};
