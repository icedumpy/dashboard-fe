import { useMemo } from "react";

import type { EChartsOption } from "echarts";

export const useBarChartOptions = (
  data: number[],
  categories: string[],
  colors?: string[]
): EChartsOption => {
  const options: EChartsOption = useMemo(
    () => ({
      ...(colors && { color: colors }),
      grid: {
        left: "2%",
        right: "10%",
        bottom: "2%",
        top: "2%",
        containLabel: true,
      },
      xAxis: { type: "value" },
      yAxis: { type: "category", data: categories },
      series: [
        { label: { show: true, position: "outside" }, data, type: "bar" },
      ],
      tooltip: { trigger: "item" },
    }),
    [data, categories, colors]
  );

  return options;
};
