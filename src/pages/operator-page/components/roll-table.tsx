import dayjs from "dayjs";
import { useEffect, useMemo } from "react";

import DataTable from "@/components/data-table";

import { useItemAPI } from "@/hooks/item/use-item";
import { COLUMNS_ROLL } from "../constants/columns-roll";
import { STATION } from "@/constants/station";
import StatisticCards from "./statistic-cards";
import useItemFilters from "../hooks/use-item-filters";
import useDataTable from "@/hooks/use-data-table";

export default function RollTable() {
  const { filters } = useItemFilters();
  const { sortingProps, page, resetPage, paginationProps } = useDataTable({
    pageQueryKey: "rollPage",
  });

  const apiParams = useMemo(
    () => ({
      ...filters,
      station: STATION.ROLL,
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

  const { data: roll, isLoading } = useItemAPI({
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
      <h3 className="font-medium text-md">Roll</h3>
      <StatisticCards data={roll?.summary} />
      <DataTable
        isLoading={isLoading}
        data={roll?.data || []}
        columns={COLUMNS_ROLL}
        sorting={sortingProps}
        pagination={paginationProps(roll?.pagination)}
      />
    </div>
  );
}
