import { useMemo } from "react";

import type { EChartsOption } from "echarts-for-react";
import type { SummaryResponse } from "@/shared/hooks/dashboard/use-summary";
import dayjs from "dayjs";
import { DATE_FORMAT } from "@/shared/constants/format";

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
    const xAxisData = data.labels.map((label) =>
      dayjs(label).format(DATE_FORMAT)
    );

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
    const baseSeries = chartData.seriesNames.map((name, index) => ({
      name,
      type: "bar" as const,
      stack: "total",
      barWidth: "60%",
      data: chartData.rawData[index] || [],
    }));

    const totalSeries = {
      name: "Total",
      type: "bar" as const,
      barWidth: "60%",
      barGap: "-100%",
      data: chartData.totalData,
      itemStyle: {
        color: "rgba(0,0,0,0)",
      },
      label: {
        show: true,
        position: "top" as const,
        formatter: (params: { value: number }) =>
          params.value > 0 ? params.value.toLocaleString() : "",
      },
      tooltip: { show: false },
      legendHoverLink: false,
    };

    return [...baseSeries, totalSeries];
  }, [chartData]);

  return useMemo(
    (): EChartsOption => ({
      ...(colors && { color: colors }),
      grid: {
        left: "2%",
        right: "2%",
        bottom: "4%",
        top: "22%",
        containLabel: true,
      },
      legend: {
        orient: "horizontal",
        top: "5%",
        left: "center",
        data: chartData.seriesNames,
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
