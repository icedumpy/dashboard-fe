import dayjs from "dayjs";
import { parseAsInteger, useQueryState } from "nuqs";
import { isEmpty } from "radash";
import { useMemo } from "react";

import DataTable from "@/components/data-table";
import { Layout } from "@/components/Layout";
import ReportSection from "@/components/report-section";

import Filters from "./components/filters";
import StatisticBundle from "./components/statistic-bundle";
import StatisticRoll from "./components/statistic-roll";

import { DATE_TIME_FORMAT } from "@/contants/format";
import { STATION } from "@/contants/station";
import { useAuth } from "@/hooks/auth/use-auth-v2";
import { useItemAPI } from "@/hooks/item/use-item";
import { useProductionLineOptions } from "@/hooks/option/use-production-line-option";
import { COLUMNS_ROLL } from "./constants/columns-roll";
import { COLUMNS_BUNDLE } from "./constants/columns-bundle";
import { useLineAPI } from "@/hooks/line/use-line";
import { ROLES } from "@/contants/auth";
import UseOperatorFilters from "./hooks/use-operator-filters";

export default function OperatorPage() {
  const { user } = useAuth();
  const { values: filters } = UseOperatorFilters();
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

  const { data: roll } = useItemAPI({
    ...filters,
    page: +rollPage,
    station: STATION.ROLL,
    status: filters.status ? [filters.status] : [],
  });
  const { data: bundle } = useItemAPI({
    ...filters,
    page: +bundlePage,
    station: STATION.BUNDLE,
    status: filters.status ? [filters.status] : [],
  });

  const getLineName = useMemo(() => {
    return lines?.data?.find(
      (l) =>
        String(l.id) === (filters?.line_id || productionLineOptions?.[0]?.value)
    )?.name;
  }, [filters?.line_id, lines?.data, productionLineOptions]);

  const title =
    user?.role === ROLES.OPERATOR ? "Operator Dashboard" : "Viewer Dashboard";

  return (
    <Layout title={title}>
      <div className="space-y-4">
        <Filters />
        <ReportSection
          filters={{
            ...filters,
            line_id: filters.line_id,
            station: "",
            status: filters.status ? [filters.status] : [],
          }}
        />
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
    </Layout>
  );
}
