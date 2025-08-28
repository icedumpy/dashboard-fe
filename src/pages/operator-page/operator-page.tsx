import dayjs from "dayjs";
import { useState } from "react";
import { FilterIcon } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { useQueryState } from "nuqs";

import Filters from "./components/filters";
import DataTable from "@/components/data-table";
import StatisticRoll from "./components/statistic-roll";
import StatisticBundle from "./components/statistic-bundle";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/hooks/auth/use-auth";
import { useItemAPI } from "@/hooks/item/use-item";
import { STATION } from "@/contants/station";
import { COLUMNS } from "./constants/columns";
import { DATE_TIME_FORMAT } from "@/contants/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { filtersSchema } from "./schema";
import { useItemSummaryAPI } from "@/hooks/item/use-sumary";
import { ROLES } from "@/contants/auth";
import { useProductionLineOptions } from "@/hooks/option/use-production-line-option";

export default function OperatorPage() {
  const { user } = useAuth();
  const [toggleFilter, setToggleFilter] = useState(false);
  const [rollPage, setRollPage] = useQueryState("rollPage", {
    defaultValue: "1",
  });
  const [bundlePage, setBundlePage] = useQueryState("bundlePage", {
    defaultValue: "1",
  });
  const [line, setLine] = useQueryState("line");

  const form = useForm({
    resolver: zodResolver(filtersSchema),
    mode: "onChange",
  });

  const filterParams = form.watch();

  const { data: productionLineOptions } = useProductionLineOptions();
  const { data: summary } = useItemSummaryAPI();
  const { data: roll } = useItemAPI({
    ...filterParams,
    page: +rollPage,
    station: STATION.ROLL,
  });
  const { data: bundle } = useItemAPI({
    ...filterParams,
    page: +bundlePage,
    station: STATION.BUNDLE,
  });

  const disabledLine = user?.role === ROLES.OPERATOR;

  return (
    <FormProvider {...form}>
      <Layout title="Operator Dashboard">
        <div className="space-y-4 ">
          <div className="flex items-center gap-2">
            <p>Production Line:</p>
            <Select
              value={String(line || user?.line.code)}
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
          <div className="border rounded">
            <div className="flex justify-between p-4 text-white rounded-t bg-gradient-to-r from-primary to-blue-700">
              <div>
                <h2 className="text-lg font-bold">
                  Production Line {user?.line?.id}
                </h2>
                <p>
                  กะ: {user?.shift.start_time} - {user?.shift.end_time}
                </p>
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
