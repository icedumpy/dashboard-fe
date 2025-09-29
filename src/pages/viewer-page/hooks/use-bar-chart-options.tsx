import { useMemo } from "react";

import type { EChartsOption } from "echarts";
import type { SummaryResponse } from "@/hooks/dashboard/use-summary";

interface UseBarChartOptionsProps {
  data?: SummaryResponse["status_totals"];
  colors?: string[];
}

export const useBarChartOptions = ({
  data,
  colors,
}: UseBarChartOptionsProps): EChartsOption => {
  const chartData = useMemo(() => {
    if (!data?.length) {
      return { categories: [], values: [] };
    }

    return {
      categories: data.map((item) => item.status_code),
      values: data.map((item) => item.count),
    };
  }, [data]);

  return useMemo(
    (): EChartsOption => ({
      ...(colors && { color: colors }),
      grid: {
        left: "2%",
        right: "10%",
        bottom: "2%",
        top: "2%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        axisLabel: {
          formatter: (value: number) => value.toLocaleString(),
        },
      },
      yAxis: {
        type: "category",
        data: chartData.categories,
        axisLabel: {
          interval: 0, // Show all labels
        },
      },
      series: [
        {
          type: "bar",
          data: chartData.values,
          label: {
            show: true,
            position: "outside",
            formatter: "{c}",
          },
          barMaxWidth: 50,
        },
      ],
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c}",
      },
    }),
    [colors, chartData.categories, chartData.values]
  );
};
