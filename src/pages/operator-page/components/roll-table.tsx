import { parseAsInteger, useQueryState } from "nuqs";

import DataTable from "@/components/data-table";

import { useItemAPI } from "@/hooks/item/use-item";
import { COLUMNS_ROLL } from "../constants/columns-roll";
import StatisticRoll from "./statistic-roll";
import useItemFilters from "../hooks/use-item-filters";
import { STATION } from "@/contants/station";
import dayjs from "dayjs";

export default function RollTable() {
  const { filters } = useItemFilters();
  const [rollPage, setRollPage] = useQueryState(
    "rollPage",
    parseAsInteger.withDefault(1)
  );
  const { data: roll } = useItemAPI({
    ...filters,
    page: +rollPage,
    station: STATION.ROLL,
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
