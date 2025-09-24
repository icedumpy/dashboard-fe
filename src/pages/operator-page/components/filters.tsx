import { useCallback, useState } from "react";
import { FilterIcon, RotateCcwIcon } from "lucide-react";
import { isEmpty } from "radash";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useItemFilters from "../hooks/use-item-filters";

import { useStationStatusOptions } from "@/hooks/option/use-station-status-option";
import { useAuth } from "@/hooks/auth/use-auth";
import { ROLES } from "@/constants/auth";
import { DATE_TIME_FORMAT } from "@/constants/format";
import { useProductionLineOptions } from "@/hooks/option/use-production-line-option";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function Filters() {
  const { user } = useAuth();
  const { filters, setFilters, resetFilters } = useItemFilters();
  const [toggleFilter, setToggleFilter] = useState(false);
  const { data: productionLineOptions } = useProductionLineOptions();
  const disabledLine = [ROLES.OPERATOR as string].includes(String(user?.role));

  const statusOptions = useStationStatusOptions();
  const isOperator = user?.role === ROLES.OPERATOR;
  const calendarDisabled = isOperator
    ? {
        before: dayjs().subtract(30, "day").toDate(),
        after: dayjs().toDate(),
      }
    : undefined;

  const filledCount = Object.entries(filters).filter(
    ([key, value]) => key !== "line_id" && !isEmpty(value)
  ).length;

  const handleClear = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <p>Production Line:</p>
        <Select
          value={filters?.line_id}
          onValueChange={(lineId) =>
            setFilters({ ...filters, line_id: lineId })
          }
          disabled={disabledLine}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select a line" />
          </SelectTrigger>
          <SelectContent>
            {productionLineOptions?.map((line) => (
              <SelectItem key={line.value} value={line.value}>
                {line.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant={filledCount || toggleFilter ? "default" : "outline"}
          onClick={() => setToggleFilter(!toggleFilter)}
        >
          <FilterIcon /> ตัวกรอง
          {filledCount != 0 && (
            <Badge className="bg-white rounded-full aspect-square text-foreground size-5">
              {filledCount}
            </Badge>
          )}
        </Button>
      </div>
      <div
        className={cn(
          "p-4 py-6 space-y-3 bg-white border rounded",
          !toggleFilter && "hidden"
        )}
      >
        <div className="flex items-center justify-between">
          <p>ตัวกรอง</p>
          <div className="flex items-center gap-2">
            <p className="text-sm">จำนวนตัวกรองที่กรอก: {filledCount}</p>
            <Button
              size="sm"
              variant="outline"
              disabled={filledCount === 0}
              onClick={handleClear}
            >
              <RotateCcwIcon />
              ล้างตัวกรอง
            </Button>
          </div>
        </div>
        <div className="grid items-baseline grid-cols-1 gap-4 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Product Code</Label>
            <Input
              value={filters.product_code}
              onChange={(e) => {
                const value = e.target.value;
                setFilters({ ...filters, product_code: value });
              }}
              placeholder="ค้นหา Product Code"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Roll Id</Label>
            <Input
              value={filters.roll_id}
              onChange={(e) => {
                const value = e.target.value;
                setFilters({ ...filters, roll_id: value });
              }}
              placeholder="ค้นหา Roll Id"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Roll/Bundle Number</Label>
            <Input
              value={filters.number}
              onChange={(e) => {
                const value = e.target.value;
                setFilters({ ...filters, number: value });
              }}
              placeholder="ค้นหา Roll/Bundle Number"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Job Order Number</Label>
            <Input
              value={filters.job_order_number}
              onChange={(e) => {
                const value = e.target.value;
                setFilters({ ...filters, job_order_number: value });
              }}
              placeholder="ค้นหา Job Order Number"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Roll Width</Label>
            <div className="flex items-end">
              <Input
                value={filters.roll_width_min}
                placeholder="Min"
                className="rounded-tr-none rounded-br-none"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value && isNaN(Number(value))) {
                    // Could add error display here
                    return;
                  }
                  setFilters({ ...filters, roll_width_min: value });
                }}
              />
              <Input
                value={filters.roll_width_max}
                placeholder="Max"
                className="border-l-0 rounded-tl-none rounded-bl-none"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value && isNaN(Number(value))) {
                    // Could add error display here
                    return;
                  }
                  setFilters({ ...filters, roll_width_max: value });
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Status</Label>
            <MultiSelect
              placeholder="เลือกสถานะ"
              options={statusOptions}
              value={
                filters.status ? filters.status.split(",").filter(Boolean) : []
              }
              onChange={(value) => {
                setFilters({ ...filters, status: value.join(",") });
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">วันที่เริ่มต้น</Label>
            <DatePicker
              dayBoundary="start"
              displayFormat={DATE_TIME_FORMAT}
              value={
                filters.detected_from
                  ? dayjs(filters.detected_from).toDate()
                  : undefined
              }
              onChange={(value) => {
                setFilters({
                  ...filters,
                  detected_from: value ? dayjs(value).toISOString() : "",
                });
              }}
              placeholder="วันที่เริ่มต้น"
              calendarProps={{ disabled: calendarDisabled }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">วันที่สิ้นสุด</Label>
            <DatePicker
              dayBoundary="end"
              displayFormat={DATE_TIME_FORMAT}
              value={
                filters.detected_to
                  ? dayjs(filters.detected_to).toDate()
                  : undefined
              }
              onChange={(value) => {
                setFilters({
                  ...filters,
                  detected_to: value ? dayjs(value).toISOString() : "",
                });
              }}
              placeholder="วันที่สิ้นสุด"
              calendarProps={{ disabled: calendarDisabled }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
