import ReactECharts from "echarts-for-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "../stat-card";
import ChartContainer from "../chart-container";

import { useBarChartOptions } from "../../hooks/use-bar-chart-options";
import { usePieChartOptions } from "../../hooks/use-pie-char-options";
import { useStackedBarOptions } from "../../hooks/use-stacked-bar-options";

import type { SummaryResponse } from "@/hooks/dashboard/use-summary";

export default function ProductionSection({
  title,
  data,
  colors,
}: {
  title: string;
  data: {
    stats?: SummaryResponse["cards"];
    barChart?: SummaryResponse["status_totals"];
    pieChart?: SummaryResponse["defect_pie"];
    stacked?: SummaryResponse["daily_stacked"];
  };
  colors?: string[];
}) {
  const barChartOptions = useBarChartOptions({ data: data.barChart, colors });
  const pieOptions = usePieChartOptions({ data: data.pieChart, colors });
  const stackBarOption = useStackedBarOptions({
    data: data?.stacked,
    colors: colors,
  });

  const statsMapped = [
    {
      label: `จำนวน ${title} ทั้งหมด`,
      value: data?.stats?.total_items ?? 0,
    },
    {
      label: "จำนวนชิ้นงานที่ตรวจสอบแล้ว",
      value: data?.stats?.inspected_items ?? 0,
    },
    {
      label: "จำนวนชิ้นงานที่รอตรวจสอบ",
      value: data?.stats?.pending_items ?? 0,
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">{title} Station</h2>
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex flex-col gap-4 md:flex-row lg:flex-col basis-1/4">
          {statsMapped.map((stat, idx) => (
            <StatCard key={idx} value={stat.value} label={stat.label} />
          ))}
        </div>
        <div className="flex flex-col w-full gap-4 basis-3/4 lg:flex-row">
          <ChartContainer
            title="ภาพรวมการผลิตแบ่งตามสถานะชิ้นงาน"
            option={barChartOptions}
          />
          <ChartContainer title="แบ่ง Defect ตามประเภท" option={pieOptions} />
        </div>
      </div>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>กราฟแสดงภาพรวมชิ้นงานในแต่ละวัน</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactECharts
            style={{ width: "100%", height: "100%", minHeight: 300 }}
            option={stackBarOption}
          />
        </CardContent>
      </Card>
    </div>
  );
}
