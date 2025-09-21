import { parseAsInteger, useQueryState } from "nuqs";

import DataTable from "@/components/data-table";

import { STATION } from "@/contants/station";
import { useItemAPI } from "@/hooks/item/use-item";
import { COLUMNS_BUNDLE } from "../constants/columns-bundle";
import StatisticBundle from "./statistic-bundle";
import useOperatorFilters from "../hooks/use-operator-filters";

export default function BundleTable() {
  const { values: filters } = useOperatorFilters();
  const [bundlePage, setBundlePage] = useQueryState(
    "bundlePage",
    parseAsInteger.withDefault(1)
  );
  const { data: bundle } = useItemAPI({
    ...filters,
    page: +bundlePage,
    station: STATION.BUNDLE,
    status: filters.status ? [filters.status] : [],
  });

  return (
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
  );
}
