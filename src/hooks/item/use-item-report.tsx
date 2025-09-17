import { useMutation } from "@tanstack/react-query";

import { ItemService } from "@/services/item-service";
import { sanitizeQueryParams } from "@/utils/sanitize-query-params";

import type { StatusT } from "@/types/status";

export interface DownloadReportParams {
  detected_from?: string;
  detected_to?: string;
  job_order_number?: string;
  line_id: string;
  roll_id?: string;
  number?: string;
  product_code?: string;
  roll_width_max?: number;
  roll_width_min?: number;
  station: StatusT;
  status?: StatusT[];
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
