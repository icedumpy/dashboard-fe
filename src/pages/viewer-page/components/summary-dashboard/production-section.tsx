import ReactECharts, { EChartsOption } from "echarts-for-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "../stat-card";
import ChartContainer from "../chart-container";

import { useBarChartOptions } from "../../hooks/use-bar-chart-options";
import { usePieChartOptions } from "../../hooks/use-pie-char-options";

export default function ProductionSection({
  title,
  data,
  colors,
  stackBarOption,
}: {
  title: string;
  data: {
    barChart: { data: number[]; categories: string[] };
    pieChart: { value: number; name: string }[];
    stats: { label: string; value: string | number }[];
  };
  colors?: string[];
  stackBarOption: EChartsOption;
}) {
  const barChartOptions = useBarChartOptions(
    data.barChart.data,
    data.barChart.categories,
    colors
  );

  const pieOptions = usePieChartOptions(data.pieChart, colors);
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex flex-col gap-4 md:flex-row lg:flex-col basis-1/4">
          {data.stats.map((stat, idx) => (
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
