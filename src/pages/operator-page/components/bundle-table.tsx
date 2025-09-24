import dayjs from "dayjs";
import { useEffect, useMemo } from "react";

import DataTable from "@/components/data-table";

import { useDataTable } from "@/hooks/use-data-table";
import { STATION } from "@/constants/station";
import { useItemAPI } from "@/hooks/item/use-item";
import { COLUMNS_BUNDLE } from "../constants/columns-bundle";
import StatisticBundle from "./statistic-bundle";
import useItemFilters from "../hooks/use-item-filters";

export default function BundleTable() {
  const { filters } = useItemFilters();

  const { sortingProps, page, resetPage, paginationProps } = useDataTable({
    pageQueryKey: "bundlePage",
  });

  const apiParams = useMemo(
    () => ({
      ...filters,
      station: STATION.BUNDLE,
      status: filters.status ? filters.status.split(",") : [],
      detected_from: filters.detected_from
        ? dayjs(filters.detected_from).toISOString()
        : undefined,
      detected_to: filters.detected_to
        ? dayjs(filters.detected_to).toISOString()
        : undefined,
    }),
    [filters]
  );

  const { data: bundle } = useItemAPI({
    ...apiParams,
    page: page,
    sort_by: sortingProps.sortBy,
    order_by: sortingProps.orderBy,
  });

  useEffect(() => {
    resetPage();
  }, [resetPage, apiParams]);

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-md">Bundle</h3>
      <StatisticBundle data={bundle?.summary} />
      <DataTable
        data={bundle?.data || []}
        columns={COLUMNS_BUNDLE}
        sorting={sortingProps}
        pagination={paginationProps(bundle?.pagination)}
      />
    </div>
  );
}
