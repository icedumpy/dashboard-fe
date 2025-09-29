import ProductionSection from "./production-section";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";

import { useProductionLineOptions } from "@/hooks/option/use-production-line-option";
import { useStackedBarOptions } from "../../hooks/use-stacked-bar-options";
import useItemFilters from "@/pages/operator-page/hooks/use-item-filters";
import dayjs from "dayjs";
import { parseAsIsoDateTime, useQueryState } from "nuqs";
import { DATE_TIME_FORMAT } from "@/constants/format";
import { getLineCode } from "@/helpers/item";
import { useLineAPI } from "@/hooks/line/use-line";

export default function SummaryDashboard() {
  const { filters, setFilters } = useItemFilters();
  const stackBarOption = useStackedBarOptions();
  const { data: productionLines } = useProductionLineOptions();
  const { data: lines } = useLineAPI();

  const [startDate, setStartDate] = useQueryState(
    "start_date",
    parseAsIsoDateTime
  );
  const [endDate, setEndDate] = useQueryState("end_date", parseAsIsoDateTime);

  const calendarDisabled = {
    before: dayjs().subtract(30, "day").toDate(),
    after: dayjs().toDate(),
  };

  const lineCode = getLineCode(Number(filters.line_id), lines?.data);

  return (
    <div className="space-y-3">
      <Card>
        <CardContent className="flex items-baseline gap-3">
          <div className="flex items-center gap-2 mt-6">
            <Label>Production Line</Label>
            <Select
              value={filters.line_id}
              onValueChange={(value) => {
                setFilters({ ...filters, line_id: value });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {productionLines?.map((line) => (
                  <SelectItem key={line.value} value={line.value}>
                    {line.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DatePicker
            displayFormat={DATE_TIME_FORMAT}
            calendarProps={{
              disabled: calendarDisabled,
            }}
            className="w-[200px]"
            placeholder="วันที่เริ่มต้น"
            value={startDate ?? undefined}
            onChange={(date) => {
              if (date) {
                setStartDate(date);
              } else {
                setStartDate(null);
              }
            }}
          />
          <DatePicker
            dayBoundary="end"
            displayFormat={DATE_TIME_FORMAT}
            calendarProps={{
              disabled: calendarDisabled,
            }}
            className="w-[200px]"
            placeholder="วันที่สิ้นสุด"
            value={endDate ?? undefined}
            onChange={(date) => {
              if (date) {
                setEndDate(date);
              } else {
                setEndDate(null);
              }
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="mb-2 border-b">
          <CardTitle>Production Line {lineCode}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProductionSection
            title={"ROLL"}
            data={{
              barChart: {
                data: [120, 200, 150, 80, 70],
                categories: [
                  "Normal",
                  "Defect",
                  "QC Passed",
                  "Rejected",
                  "Scrap",
                ],
              },
              pieChart: [
                {
                  value: 1048,
                  name: "ฉลาก",
                },
                {
                  value: 735,
                  name: "รอยขีด",
                },
                {
                  value: 580,
                  name: "บาร์โค้ด",
                },
              ],
              stats: [
                { label: "จำนวน Roll ทั้งหมด", value: 999999 },
                { label: "จำนวนชิ้นงานที่ตรวจสอบแล้ว", value: 999999 },
                { label: "จำนวนชิ้นงานที่รอตรวจสอบ", value: 999999 },
              ],
            }}
            // colors={COLORS_PASTEL}
            stackBarOption={stackBarOption}
          />
          <ProductionSection
            title={"BUNDLE"}
            data={{
              barChart: {
                data: [120, 200, 150, 80, 70],
                categories: [
                  "Normal",
                  "Defect",
                  "QC Passed",
                  "Rejected",
                  "Scrap",
                ],
              },
              pieChart: [
                {
                  value: 1048,
                  name: "ฉลาก",
                },
                {
                  value: 735,
                  name: "รอยขีด",
                },
                {
                  value: 580,
                  name: "บาร์โค้ด",
                },
              ],
              stats: [
                { label: "จำนวน Roll ทั้งหมด", value: 999999 },
                { label: "จำนวนชิ้นงานที่ตรวจสอบแล้ว", value: 999999 },
                { label: "จำนวนชิ้นงานที่รอตรวจสอบ", value: 999999 },
              ],
            }}
            // colors={COLORS_BRIGHT}
            stackBarOption={stackBarOption}
          />
        </CardContent>
      </Card>
    </div>
  );
}
