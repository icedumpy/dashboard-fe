import { EChartsOption } from "echarts-for-react";
import { useMemo } from "react";

interface UseStackedBarOptionsProps {
  colors?: string[];
}

export function useStackedBarOptions({
  colors,
}: UseStackedBarOptionsProps): EChartsOption {
  const options = useMemo(() => {
    const rawData = [
      [100, 302, 301, 334, 390, 330, 320],
      [320, 132, 101, 134, 90, 230, 210],
      [220, 182, 191, 234, 290, 330, 310],
      [150, 212, 201, 154, 190, 330, 410],
      [820, 832, 901, 934, 1290, 1330, 1320],
    ];

    const seriesNames = ["Normal", "Defect", "Scrap", "QC Passed", "Rejected"];

    const series = seriesNames.map((name, sid) => ({
      name,
      type: "bar",
      stack: true,
      barWidth: "60%",
      label: {
        show: sid === seriesNames.length - 1,
        formatter: (param: { dataIndex: number }) => {
          let sum = 0;
          series.forEach((item) => {
            sum += item.data[param.dataIndex];
          });
          return sum;
        },
        position: "top",
      },
      data: rawData[sid],
    }));

    return {
      ...(colors && { color: colors }),
      grid: {
        left: "2%",
        right: "2%",
        bottom: "15%",
        containLabel: true,
      },
      legend: {
        orient: "horizontal",
        bottom: true,
      },
      tooltip: {
        trigger: "axis",
      },
      yAxis: {
        type: "value",
      },
      xAxis: {
        type: "category",
        data: [
          "01/09/2025",
          "02/09/2025",
          "03/09/2025",
          "04/09/2025",
          "05/09/2025",
          "06/09/2025",
          "07/09/2025",
        ],
      },
      series,
    };
  }, [colors]);

  return options;
}
