import { useMemo } from "react";

import type { EChartsOption } from "echarts-for-react";
import type { SummaryResponse } from "@/hooks/dashboard/use-summary";

interface UseStackedBarOptionsProps {
  colors?: string[];
  data?: SummaryResponse["daily_stacked"];
}

export function useStackedBarOptions({
  data,
  colors,
}: UseStackedBarOptionsProps): EChartsOption {
  // Transform data with proper validation
  const chartData = useMemo(() => {
    if (!data?.series?.length || !data?.labels?.length) {
      return {
        rawData: [],
        seriesNames: [],
        xAxisData: [],
        totalData: [],
      };
    }

    const rawData = data.series.map((s) => s.data);
    const seriesNames = data.series.map((s) => s.status_code);
    const xAxisData = data.labels;

    // Calculate totals for each data point
    const totalData = xAxisData.map((_, index) =>
      rawData.reduce((sum, series) => sum + (series[index] || 0), 0)
    );

    return {
      rawData,
      seriesNames,
      xAxisData,
      totalData,
    };
  }, [data]);

  // Generate series configuration
  const seriesConfig = useMemo(() => {
    return chartData.seriesNames.map((name, index) => ({
      name,
      type: "bar" as const,
      stack: "total",
      barWidth: "60%",
      data: chartData.rawData[index] || [],
      label: {
        show: index === chartData.seriesNames.length - 1,
        position: "top" as const,
        formatter: (params: { dataIndex: number }) => {
          // Calculate sum for all series at this data point
          let totalSum = 0;
          chartData.rawData.forEach((seriesData) => {
            totalSum += seriesData[params.dataIndex] || 0;
          });

          return totalSum > 0 ? totalSum.toLocaleString() : "";
        },
      },
    }));
  }, [chartData]);

  return useMemo(
    (): EChartsOption => ({
      ...(colors && { color: colors }),
      grid: {
        left: "2%",
        right: "2%",
        bottom: "4%",
        top: "16%",
        containLabel: true,
      },
      legend: {
        orient: "horizontal",
        top: "5%",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      xAxis: {
        type: "category",
        data: chartData.xAxisData,
        axisLabel: {
          rotate: chartData.xAxisData.length > 7 ? 45 : 0,
          interval: 0,
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: (value: number) => value.toLocaleString(),
        },
      },
      series: seriesConfig,
    }),
    [colors, chartData, seriesConfig]
  );
}
