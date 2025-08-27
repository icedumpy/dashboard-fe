import axiosInstance from "@/lib/axios-instance";
import { GET_PRODUCTION_LINE_OPTIONS } from "@/contants/line";

import type { ProductionLineT } from "@/types/line";
import type { OptionT } from "@/types/option";

export const OptionService = {
  getProductionLine: async () => {
    const response = await axiosInstance.get(GET_PRODUCTION_LINE_OPTIONS);

    const options = (response?.data?.data as ProductionLineT[]).map((item) => ({
      value: item.code,
      label: item.name,
    }));

    return options as OptionT[];
  },
};
