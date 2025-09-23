import { parseAsInteger, useQueryState } from "nuqs";

import DataTable from "@/components/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { REVIEW_COLUMNS } from "../constants/review-columns";
import { useAuth } from "@/hooks/auth/use-auth";
import { useProductionLineOptions } from "@/hooks/option/use-production-line-option";
import { useGetChangeStatus } from "@/hooks/change-status/use-get-change-status";
import { useState } from "react";
import { OrderBy } from "@/types/order";

export default function ReviewTable() {
  const { user } = useAuth();
  const [, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [line, setLine] = useQueryState("line_id", {
    defaultValue: user?.line?.id ? String(user.line?.id) : "",
  });

  const [sortBy, setSortBy] = useState<string>("");
  const [orderBy, setOrderBy] = useState<OrderBy>("");
  const { data: changeStatus } = useGetChangeStatus({
    line_id: line,
    sort_by: sortBy,
    order_by: orderBy,
  });

  const { data: lineOptions } = useProductionLineOptions();
  return (
    <div className="p-4 space-y-3 bg-white border rounded-md">
      <div className="flex justify-between gap-2">
        <p>รายการที่รอตรวจสอบการแก้ไขสถานะ</p>
        <div className="flex justify-between gap-2">
          <Select
            value={line}
            onValueChange={(value) => {
              setPage(1);
              setLine(value);
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
        columns={REVIEW_COLUMNS}
        data={changeStatus?.data ?? []}
        sorting={{
          sortBy,
          orderBy,
          onSortChange: ({ sortBy, orderBy }) => {
            setSortBy(sortBy);
            setOrderBy(orderBy);
          },
        }}
        pagination={{
          ...changeStatus?.pagination,
          onPageChange(page) {
            setPage(page);
          },
        }}
      />
    </div>
  );
}
