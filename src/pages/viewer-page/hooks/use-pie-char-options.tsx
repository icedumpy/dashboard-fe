import { useMemo } from "react";

import type { EChartsOption } from "echarts";

type PieChartData = { value: number; name: string };

export function usePieChartOptions(
  data: PieChartData[],
  colors?: string[]
): EChartsOption {
  const options: EChartsOption = useMemo(
    () => ({
      ...(colors && { color: colors }),
      tooltip: { trigger: "item" },
      legend: { orient: "horizontal", top: "top" },
      series: [
        {
          type: "pie",
          radius: ["0%", "70%"],
          data,
          label: {
            show: true,
            position: "inside",
            formatter: "{b}\n{c}\n({d}%)",
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    }),
    [data, colors]
  );

  return options;
}
