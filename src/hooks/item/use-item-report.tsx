import { useMutation } from "@tanstack/react-query";

import { STATION, STATION_STATUS } from "@/contants/station";
import { ItemService } from "@/services/item-service";
import { sanitizeQueryParams } from "@/utils/sanitize-query-params";

export interface DownloadReportParams {
  detected_from?: string;
  detected_to?: string;
  job_order_number?: string;
  line_id: string;
  number?: string;
  product_code?: string;
  roll_width_max?: number;
  roll_width_min?: number;
  station: (typeof STATION)[keyof typeof STATION];
  status?: (typeof STATION_STATUS)[keyof typeof STATION_STATUS][];
}

export const useItemReportAPI = () =>
  useMutation({
    mutationFn: async (params?: DownloadReportParams) => {
      const response = await ItemService.itemReport(
        sanitizeQueryParams(params)
      );
      return response;
    },
  });
