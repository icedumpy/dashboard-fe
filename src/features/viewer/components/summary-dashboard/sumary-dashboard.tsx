import { RotateCcwIcon } from "lucide-react";
import dayjs from "dayjs";

import ProductionSection from "./production-section";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";

import { useProductionLineOptions } from "@/shared/hooks/option/use-production-line-option";
import useItemFilters from "@/features/operator/hooks/use-item-filters";
import { parseAsIsoDateTime, useQueryState } from "nuqs";
import { DATE_FORMAT, DATE_FORMAT_ISO } from "@/shared/constants/format";
import { getLineCode } from "@/shared/helpers/item";
import { useLineAPI } from "@/shared/hooks/line/use-line";
import { COLORS_PASTEL } from "@/shared/constants/chart";
import { useSummary } from "@/shared/hooks/dashboard/use-summary";
import { STATION } from "@/shared/constants/station";

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

  const clearFilters = () => {
    setDateFrom(null);
    setDateTo(null);
  };

  return (
    <div className="space-y-3">
      <Card>
        <CardContent className="flex flex-col items-start gap-3 pt-6 md:items-center md:flex-row">
          <div className="flex flex-col items-start justify-start gap-2 md:items-center md:flex-row">
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
            displayFormat={DATE_FORMAT}
            calendarProps={{
              disabled: calendarDisabled,
            }}
            disableTime
            className="w-full md:w-[200px]"
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
            displayFormat={DATE_FORMAT}
            calendarProps={{
              disabled: calendarDisabled,
            }}
            className="w-full md:w-[200px]"
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
          <Button
            variant="outline"
            className="w-full md:w-fit"
            disabled={!dateFrom && !dateTo}
            onClick={clearFilters}
          >
            <RotateCcwIcon /> ล้างตัวกรอง
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="mb-2 border-b">
          <CardTitle>Production Line {lineCode}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProductionSection
            title={"Roll"}
            data={{
              stats: rollSummary?.cards,
              barChart: rollSummary?.status_totals,
              pieChart: rollSummary?.defect_pie,
              stacked: rollSummary?.daily_stacked,
            }}
          />
          <ProductionSection
            title={"Bundle"}
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
