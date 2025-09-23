import { useState } from "react";
import { parseAsInteger, useQueryState } from "nuqs";

import DataTable from "@/components/data-table";

import { STATION } from "@/constants/station";
import { useItemAPI } from "@/hooks/item/use-item";
import { COLUMNS_ROLL } from "../constants/columns-roll";
import StatisticRoll from "./statistic-roll";
import useOperatorFilters from "../hooks/use-operator-filters";

import type { OrderBy } from "@/types/order";

export default function RollTable() {
  const { values: filters } = useOperatorFilters();
  const [sortBy, setSortBy] = useState<string>("");
  const [orderBy, setOrderBy] = useState<OrderBy>("");
  const [rollPage, setRollPage] = useQueryState(
    "rollPage",
    parseAsInteger.withDefault(1)
  );
  const { data: roll } = useItemAPI({
    ...filters,
    page: +rollPage,
    station: STATION.ROLL,
    sort_by: sortBy,
    order_by: orderBy,
    status: filters.status ? filters.status.split(",") : [],
  });

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-md">Roll</h3>
      <StatisticRoll data={roll?.summary} />
      <DataTable
        data={roll?.data || []}
        columns={COLUMNS_ROLL}
        sorting={{
          sortBy,
          orderBy,
          onSortChange: ({ sortBy, orderBy }) => {
            setSortBy(sortBy);
            setOrderBy(orderBy);
          },
        }}
        pagination={{
          ...roll?.pagination,
          onPageChange(page) {
            setRollPage(page);
          },
        }}
      />
    </div>
  );
}
