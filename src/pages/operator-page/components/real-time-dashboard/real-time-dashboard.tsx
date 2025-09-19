import dayjs from "dayjs";
import { isArray, isEmpty } from "radash";
import { useMemo, useState } from "react";
import { parseAsInteger, useQueryState } from "nuqs";

import OperatorFilter from "@/pages/operator-page/components/filters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import StatisticBundle from "@/pages/operator-page/components/statistic-bundle";
import StatisticRoll from "@/pages/operator-page/components/statistic-roll";
import DataTable from "@/components/data-table";

import useOperatorFilters from "@/pages/operator-page/hooks/use-operator-filters";
import { DATE_TIME_FORMAT } from "@/contants/format";
import { useAuth } from "@/hooks/auth/use-auth-v2";
import { useProductionLineOptions } from "@/hooks/option/use-production-line-option";
import { useLineAPI } from "@/hooks/line/use-line";
import { ROLES } from "@/contants/auth";
import { COLUMNS_ROLL } from "@/pages/operator-page/constants/columns-roll";
import { COLUMNS_BUNDLE } from "@/pages/operator-page/constants/columns-bundle";
import { useItemAPI } from "@/hooks/item/use-item";
import { STATION } from "@/contants/station";

export default function RealTimeDashboard() {
  const { user } = useAuth();
  const { values: filters } = useOperatorFilters();
  const [toggleFilter, setToggleFilter] = useState(false);
  const [rollPage, setRollPage] = useQueryState(
    "rollPage",
    parseAsInteger.withDefault(1)
  );
  const [bundlePage, setBundlePage] = useQueryState(
    "bundlePage",
    parseAsInteger.withDefault(1)
  );
  const { data: lines } = useLineAPI();
  const { data: productionLineOptions } = useProductionLineOptions();
  const disabledLine = [ROLES.OPERATOR as string].includes(String(user?.role));

  const [line, setLine] = useQueryState("line", {
    defaultValue: user?.line?.id
      ? String(user?.line?.id)
      : isArray(productionLineOptions)
      ? String(productionLineOptions[0].value)
      : "",
  });

  const getLineName = useMemo(() => {
    return lines?.data?.find(
      (l) => String(l.id) === (line || productionLineOptions?.[0]?.value)
    )?.name;
  }, [line, lines?.data, productionLineOptions]);

  const { data: roll } = useItemAPI({
    ...filters,
    page: +rollPage,
    line_id: line,
    station: STATION.ROLL,
    status: filters.status ? [filters.status] : [],
  });
  const { data: bundle } = useItemAPI({
    ...filters,
    page: +bundlePage,
    line_id: line,
    station: STATION.BUNDLE,
    status: filters.status ? [filters.status] : [],
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <p>Production Line:</p>
        <Select
          value={line || productionLineOptions?.[0]?.value}
          onValueChange={setLine}
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
          variant={toggleFilter ? "default" : "outline"}
          onClick={() => setToggleFilter(!toggleFilter)}
        >
          <FilterIcon /> ตัวกรอง
        </Button>
      </div>
      {toggleFilter && <OperatorFilter />}
      <div className="bg-white border rounded">
        <div className="flex items-center justify-between p-4 text-white bg-blue-700 rounded-t">
          <div>
            <h2 className="text-lg font-bold">{getLineName}</h2>
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
            <StatisticRoll data={roll?.summary} />
            <DataTable
              data={roll?.data || []}
              columns={COLUMNS_ROLL}
              pagination={{
                ...roll?.pagination,
                onPageChange(page) {
                  setRollPage(page);
                },
              }}
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-md">Bundle</h3>
            <StatisticBundle data={bundle?.summary} />
            <DataTable
              data={bundle?.data || []}
              columns={COLUMNS_BUNDLE}
              pagination={{
                ...bundle?.pagination,
                onPageChange(page) {
                  setBundlePage(page);
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
