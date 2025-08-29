import dayjs from "dayjs";
import { useState } from "react";
import { FilterIcon } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { useQueryState } from "nuqs";
import { isArray, isEmpty } from "radash";

import Filters from "./components/filters";
import DataTable from "@/components/data-table";
import StatisticRoll from "./components/statistic-roll";
import StatisticBundle from "./components/statistic-bundle";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import ReportSection from "@/components/report-section";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/hooks/auth/use-auth-v2";
import { useItemAPI } from "@/hooks/item/use-item";
import { STATION } from "@/contants/station";
import { COLUMNS } from "./constants/columns";
import { DATE_TIME_FORMAT } from "@/contants/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { filtersSchema } from "./schema";
import { useItemSummaryAPI } from "@/hooks/item/use-sumary";
import { useProductionLineOptions } from "@/hooks/option/use-production-line-option";
import { ROLES } from "@/contants/auth";

export default function OperatorPage() {
  const { user } = useAuth();
  const [toggleFilter, setToggleFilter] = useState(false);
  const [rollPage, setRollPage] = useQueryState("rollPage", {
    defaultValue: "1",
  });
  const [bundlePage, setBundlePage] = useQueryState("bundlePage", {
    defaultValue: "1",
  });
  const { data: productionLineOptions } = useProductionLineOptions();
  const [line, setLine] = useQueryState("line", {
    defaultValue: user?.line?.id
      ? String(user?.line?.id)
      : isArray(productionLineOptions)
      ? String(productionLineOptions[0].value)
      : "",
  });

  const form = useForm({
    resolver: zodResolver(filtersSchema),
    mode: "onChange",
  });

  const filterParams = form.watch();

  const { data: summary } = useItemSummaryAPI();
  const { data: roll } = useItemAPI({
    ...filterParams,
    page: +rollPage,
    line_id: line,
    station: STATION.ROLL,
  });
  const { data: bundle } = useItemAPI({
    ...filterParams,
    page: +bundlePage,
    line_id: line,
    station: STATION.BUNDLE,
  });

  const disabledLine = [ROLES.OPERATOR as string].includes(user?.role ?? "");

  return (
    <FormProvider {...form}>
      <Layout title="Operator Dashboard">
        <div className="space-y-4 ">
          <div className="flex items-center gap-2">
            <p>Production Line:</p>
            <Select
              value={line}
              onValueChange={setLine}
              disabled={disabledLine}
            >
              <SelectTrigger>
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
              variant={toggleFilter ? "default" : "outline"}
              onClick={() => setToggleFilter(!toggleFilter)}
            >
              <FilterIcon /> ตัวกรอง
            </Button>
          </div>
          {toggleFilter && <Filters />}
          <ReportSection
            filters={{
              detected_from: filterParams.detected_from,
              detected_to: filterParams.detected_to,
              job_order_number: filterParams.job_order_number,
              line_id: line,
              number: filterParams.number,
              product_code: filterParams.product_code,
              roll_width_max: filterParams.roll_width_max,
              roll_width_min: filterParams.roll_width_min,
              station: STATION.ROLL,
              status: filterParams.status,
            }}
          />
          <div className="border rounded">
            <div className="flex items-center justify-between p-4 text-white rounded-t bg-gradient-to-r from-primary to-blue-700">
              <div>
                <h2 className="text-lg font-bold">Production Line {line}</h2>
                {!isEmpty(user?.shift) && (
                  <p>
                    กะ: {user?.shift?.start_time} - {user?.shift?.end_time}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm">อัปเดตล่าสุด</p>
                <p>{dayjs().format(DATE_TIME_FORMAT)}</p>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="space-y-2">
                <h3 className="font-medium text-md">Roll</h3>
                <StatisticRoll data={summary?.roll} />
                <DataTable
                  data={roll?.data || []}
                  columns={COLUMNS}
                  pagination={{
                    ...roll?.pagination,
                    onPageChange(page) {
                      setRollPage(String(page));
                    },
                  }}
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-md">Bundle</h3>
                <StatisticBundle data={summary?.bundle} />
                <DataTable
                  data={bundle?.data || []}
                  columns={COLUMNS}
                  pagination={{
                    ...bundle?.pagination,
                    onPageChange(page) {
                      setBundlePage(String(page));
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </FormProvider>
  );
}
