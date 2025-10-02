import { useMemo } from "react";

import type { EChartsOption } from "echarts";
import type { SummaryResponse } from "@/shared/hooks/dashboard/use-summary";

interface UsePieChartOptionsProps {
  data?: SummaryResponse["defect_pie"];
  colors?: string[];
}

export function usePieChartOptions({
  data,
  colors,
}: UsePieChartOptionsProps): EChartsOption {
  const _data = data?.by_type?.map((item) => {
    return { value: item.count, name: item.name_th };
  });

  const options: EChartsOption = useMemo(
    () => ({
      ...(colors && { color: colors }),
      tooltip: { trigger: "item" },
      legend: { orient: "horizontal", top: "top" },
      series: [
        {
          type: "pie",
          radius: ["0%", "70%"],
          data: _data,
          label: {
            show: true,
            position: "inside",
            formatter: "{b}\n{d}%",
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
    [colors, _data]
  );

  return options;
}
