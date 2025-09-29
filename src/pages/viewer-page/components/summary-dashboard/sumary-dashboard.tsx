import dayjs from "dayjs";

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
import useItemFilters from "@/pages/operator-page/hooks/use-item-filters";
import { parseAsIsoDateTime, useQueryState } from "nuqs";
import { DATE_FORMAT_ISO } from "@/constants/format";
import { getLineCode } from "@/helpers/item";
import { useLineAPI } from "@/hooks/line/use-line";
import { COLORS_PASTEL } from "@/constants/chart";
import { useSummary } from "@/hooks/dashboard/use-summary";
import { STATION } from "@/constants/station";

export default function SummaryDashboard() {
  const { filters, setFilters } = useItemFilters();
  const { data: productionLines } = useProductionLineOptions();
  const { data: lines } = useLineAPI();

  const [dateFrom, setDateFrom] = useQueryState(
    "date_from",
    parseAsIsoDateTime
  );
  const [dateTo, setDateTo] = useQueryState("date_to", parseAsIsoDateTime);

  const calendarDisabled = {
    before: dayjs().subtract(30, "day").toDate(),
    after: dayjs().toDate(),
  };

  const lineCode = getLineCode(Number(filters.line_id), lines?.data);

  const { data: rollSummary } = useSummary({
    line_id: Number(filters.line_id),
    station: STATION.ROLL,
    date_from: dateFrom ? dayjs(dateFrom).format(DATE_FORMAT_ISO) : undefined,
    date_to: dateTo ? dayjs(dateTo).format(DATE_FORMAT_ISO) : undefined,
  });

  const { data: bundleSummary } = useSummary({
    line_id: Number(filters.line_id),
    station: STATION.BUNDLE,
    date_from: dateFrom ? dayjs(dateFrom).format(DATE_FORMAT_ISO) : undefined,
    date_to: dateTo ? dayjs(dateTo).format(DATE_FORMAT_ISO) : undefined,
  });

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
            displayFormat={DATE_FORMAT_ISO}
            calendarProps={{
              disabled: calendarDisabled,
            }}
            disableTime
            className="w-[200px]"
            placeholder="วันที่เริ่มต้น"
            value={dateFrom ?? undefined}
            onChange={(date) => {
              if (date) {
                setDateFrom(date);
              } else {
                setDateFrom(null);
              }
            }}
          />
          <DatePicker
            dayBoundary="end"
            disableTime
            displayFormat={DATE_FORMAT_ISO}
            calendarProps={{
              disabled: calendarDisabled,
            }}
            className="w-[200px]"
            placeholder="วันที่สิ้นสุด"
            value={dateTo ?? undefined}
            onChange={(date) => {
              if (date) {
                setDateTo(date);
              } else {
                setDateTo(null);
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
              stats: rollSummary?.cards,
              barChart: rollSummary?.status_totals,
              pieChart: rollSummary?.defect_pie,
              stacked: rollSummary?.daily_stacked,
            }}
          />
          <ProductionSection
            title={"BUNDLE"}
            data={{
              stats: bundleSummary?.cards,
              barChart: bundleSummary?.status_totals,
              pieChart: bundleSummary?.defect_pie,
              stacked: bundleSummary?.daily_stacked,
            }}
            colors={COLORS_PASTEL}
          />
        </CardContent>
      </Card>
    </div>
  );
}
