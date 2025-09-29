import { useQuery } from "@tanstack/react-query";

import { DASHBOARD_SUMMARY_ENDPOINT } from "@/constants/api";
import { DashboardService } from "@/services/dashboard-service";

import type { StationType } from "@/types/station";

export interface SummaryParams {
  line_id: number;
  station: StationType;
  date_form?: string | Date;
  date_to?: string | Date;
}

export interface SummaryResponse {
  cards: {
    inspected_items: number;
    pending_items: number;
    total_items: number;
  };
  status_totals: [
    {
      status_code: string;
      count: number;
    }
  ];
  defect_pie: {
    total: number;
    by_type: {
      defect_type_id: number;
      code: string;
      name_th: string;
      count: number;
      pct: number;
    }[];
  };
  daily_stacked: {
    labels: string[];
    series: {
      status_code: string;
      data: number[];
    }[];
  };
}

export const useSummary = (params: SummaryParams) =>
  useQuery<SummaryResponse>({
    queryKey: [DASHBOARD_SUMMARY_ENDPOINT, params],
    queryFn: () => DashboardService.getSummary(params),
    enabled: Boolean(params.line_id && params.station),
  });
