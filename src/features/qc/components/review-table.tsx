import DataTable from "@/shared/components/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { REVIEW_COLUMNS } from "../constants/review-columns";
import { useProductionLineOptions } from "@/shared/hooks/option/use-production-line-option";
import { useGetChangeStatus } from "@/shared/hooks/change-status/use-get-change-status";
import useItemFilters from "@/features/operator/hooks/use-item-filters";
import useDataTable from "@/shared/hooks/use-data-table";

export default function ReviewTable() {
  const { filters, setFilters } = useItemFilters();
  const { sortingProps, page, resetPage, paginationProps } = useDataTable({
    pageQueryKey: "page",
  });

  const { data: changeStatus, isLoading } = useGetChangeStatus({
    page: page,
    line_id: filters.line_id,
    sort_by: sortingProps.sortBy,
    order_by: sortingProps.orderBy,
  });

  const { data: lineOptions } = useProductionLineOptions();
  return (
    <div className="p-4 space-y-3 bg-white border rounded-md">
      <div className="flex justify-between gap-2">
        <p>รายการที่รอตรวจสอบการแก้ไขสถานะ</p>
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
        </div>
      </div>
      <DataTable
        isLoading={isLoading}
        columns={REVIEW_COLUMNS}
        data={changeStatus?.data ?? []}
        sorting={sortingProps}
        pagination={paginationProps(changeStatus?.pagination)}
      />
    </div>
  );
}
