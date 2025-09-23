import dayjs from "dayjs";
import { useState } from "react";
import { parseAsInteger, useQueryState } from "nuqs";

import DataTable from "@/components/data-table";

import { STATION } from "@/constants/station";
import { useItemAPI } from "@/hooks/item/use-item";
import { COLUMNS_BUNDLE } from "../constants/columns-bundle";
import StatisticBundle from "./statistic-bundle";
import useItemFilters from "../hooks/use-item-filters";

import type { OrderBy } from "@/types/order";

export default function BundleTable() {
  const { filters } = useItemFilters();
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
    detected_from: filters.detected_from
      ? dayjs(filters.detected_from).toISOString()
      : undefined,
    detected_to: filters.detected_to
      ? dayjs(filters.detected_to).toISOString()
      : undefined,
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
