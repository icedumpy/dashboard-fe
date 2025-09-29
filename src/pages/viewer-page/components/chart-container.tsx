import ReactECharts, { EChartsOption } from "echarts-for-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ChartContainer({
  title,
  option,
}: {
  title: string;
  option: EChartsOption;
}) {
  return (
    <Card className="flex flex-col shadow-none basis-1/2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1">
        <ReactECharts
          style={{ width: "100%", height: "100%", minHeight: 300 }}
          option={option}
        />
      </CardContent>
    </Card>
  );
}
