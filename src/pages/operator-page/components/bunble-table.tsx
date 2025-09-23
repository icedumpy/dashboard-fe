import { useState } from "react";
import { parseAsInteger, useQueryState } from "nuqs";

import DataTable from "@/components/data-table";

import { STATION } from "@/constants/station";
import { useItemAPI } from "@/hooks/item/use-item";
import { COLUMNS_BUNDLE } from "../constants/columns-bundle";
import StatisticBundle from "./statistic-bundle";
import useOperatorFilters from "@/pages/operator-page/hooks/use-operator-filters";

import type { OrderBy } from "@/types/order";

export default function BundleTable() {
  const { values: filters } = useOperatorFilters();
  const [sortBy, setSortBy] = useState<string>("");
  const [orderBy, setOrderBy] = useState<OrderBy>("");
  const [bundlePage, setBundlePage] = useQueryState(
    "bundlePage",
    parseAsInteger.withDefault(1)
  );

  const { data: bundle } = useItemAPI({
    ...filters,
    page: +bundlePage,
    station: STATION.BUNDLE,
    sort_by: sortBy,
    order_by: orderBy,
    status: filters.status ? filters.status.split(",") : [],
  });

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-md">Bundle</h3>
      <StatisticBundle data={bundle?.summary} />
      <DataTable
        data={bundle?.data || []}
        columns={COLUMNS_BUNDLE}
        sorting={{
          sortBy,
          orderBy,
          onSortChange: ({ sortBy, orderBy }) => {
            setSortBy(sortBy);
            setOrderBy(orderBy);
          },
        }}
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
