import { useQueryState } from "nuqs";

import DataTable from "@/components/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ALL_OPTION } from "@/constants/option";
import { REVIEW_STATE } from "@/constants/review";
import { useDefectOptionAPI } from "@/hooks/option/use-defect-option";
import { useProductionLineOptions } from "@/hooks/option/use-production-line-option";
import { useReviewAPI } from "@/hooks/review/use-review";
import { WAITING_COLUMNS } from "../constants/waiting-columns";
import useItemFilters from "@/pages/operator-page/hooks/use-item-filters";
import useDataTable from "@/hooks/use-data-table";

export default function WaitingReviewTable() {
  const { filters, setFilters } = useItemFilters();
  const { sortingProps, page, resetPage, paginationProps } = useDataTable({
    pageQueryKey: "page",
  });

  const [defect, setDefect] = useQueryState("defect", {
    defaultValue: "all",
  });

  const { data: lineOptions } = useProductionLineOptions();
  const { data: defectOptions } = useDefectOptionAPI();
  const { data, isLoading } = useReviewAPI({
    page: page,
    line_id: filters.line_id,
    review_state: [REVIEW_STATE.PENDING],
    defect_type_id: defect === "all" ? undefined : defect,
    sort_by: sortingProps?.sortBy,
    order_by: sortingProps?.orderBy,
  });

  return (
    <div className="p-4 space-y-3 bg-white border rounded-md">
      <div className="flex justify-between gap-2">
        <p>รายการที่รอตรวจสอบ</p>
        <div className="flex justify-between gap-2">
          <Select
            value={filters.line_id}
            onValueChange={(value) => {
              resetPage();
              setFilters({ ...filters, line_id: value });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="เลือกสถานะ" />
            </SelectTrigger>
            <SelectContent>
              {lineOptions?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={defect} onValueChange={setDefect}>
            <SelectTrigger>
              <SelectValue className="w-2xs" placeholder="เลือกประเภทความผิด" />
            </SelectTrigger>
            <SelectContent>
              {[...ALL_OPTION, ...(defectOptions ?? [])]?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DataTable
        isLoading={isLoading}
        columns={WAITING_COLUMNS}
        data={data?.data ?? []}
        sorting={sortingProps}
        pagination={paginationProps(data?.pagination)}
      />
    </div>
  );
}
