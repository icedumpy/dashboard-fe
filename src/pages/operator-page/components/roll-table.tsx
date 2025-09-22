import { parseAsInteger, useQueryState } from "nuqs";

import DataTable from "@/components/data-table";

import { STATION } from "@/contants/station";
import { useItemAPI } from "@/hooks/item/use-item";
import { COLUMNS_ROLL } from "../constants/columns-roll";
import StatisticRoll from "./statistic-roll";
import useOperatorFilters from "../hooks/use-operator-filters";

export default function RollTable() {
  const { values: filters } = useOperatorFilters();
  const [rollPage, setRollPage] = useQueryState(
    "rollPage",
    parseAsInteger.withDefault(1)
  );
  const { data: roll } = useItemAPI({
    ...filters,
    page: +rollPage,
    station: STATION.ROLL,
    status: filters.status ? filters.status.split(",") : [],
  });

  return (
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
  );
}
