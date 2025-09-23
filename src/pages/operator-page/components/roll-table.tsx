import dayjs from "dayjs";
import { useEffect, useMemo } from "react";

import DataTable from "@/components/data-table";

import { useItemAPI } from "@/hooks/item/use-item";
import { COLUMNS_ROLL } from "../constants/columns-roll";
import { STATION } from "@/constants/station";
import StatisticRoll from "./statistic-roll";
import useItemFilters from "../hooks/use-item-filters";
import useDataTable from "@/hooks/use-data-table";

export default function RollTable() {
  const { filters } = useItemFilters();
  const dataTable = useDataTable({
    pageQueryKey: "rollPage",
    resetPageOnFiltersChange: true,
  });

  const apiParams = useMemo(
    () => ({
      ...filters,
      page: dataTable.page,
      station: STATION.ROLL,
      sort_by: dataTable.sortBy,
      order_by: dataTable.orderBy,
      status: filters.status ? filters.status.split(",") : [],
      detected_from: filters.detected_from
        ? dayjs(filters.detected_from).toISOString()
        : undefined,
      detected_to: filters.detected_to
        ? dayjs(filters.detected_to).toISOString()
        : undefined,
    }),
    [filters, dataTable.page, dataTable.sortBy, dataTable.orderBy]
  );

  const { data: roll } = useItemAPI(apiParams);

  useEffect(() => {
    dataTable.resetPage();
  }, [filters, dataTable]);

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-md">Roll</h3>
      <StatisticRoll data={roll?.summary} />
      <DataTable
        data={roll?.data || []}
        columns={COLUMNS_ROLL}
        sorting={dataTable.sortingProps}
        pagination={dataTable.paginationProps(roll?.pagination)}
      />
    </div>
  );
}
