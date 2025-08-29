import { parseAsInteger, useQueryState } from "nuqs";

import DataTable from "@/components/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/hooks/auth/use-auth-v2";
import { useItemAPI } from "@/hooks/item/use-item";
import { useDefectOptionAPI } from "@/hooks/option/use-defect-option";
import { useProductionLineOptions } from "@/hooks/option/use-production-line-option";
import { COLUMNS } from "../constants/columns";

export default function WaitingReviewTable() {
  const { user } = useAuth();
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [line, setLine] = useQueryState("line", {
    defaultValue: user?.line?.id ? String(user.line?.id) : "",
  });
  const [defect, setDefect] = useQueryState("defect", {
    defaultValue: "",
  });

  const { data: lineOptions } = useProductionLineOptions();
  const { data: defectOptions } = useDefectOptionAPI();
  const { data } = useItemAPI({
    page: page,
    line_id: line,
    status: [defect],
  });

  return (
    <div className="p-4 space-y-3 bg-white border rounded-md">
      <div className="flex justify-between gap-2">
        <p>รายการที่รอตรวจสอบ</p>
        <div className="flex justify-between gap-2">
          <Select value={line} onValueChange={setLine}>
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
              {defectOptions?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DataTable
        columns={COLUMNS}
        data={data?.data ?? []}
        pagination={{
          ...data?.pagination,
          onPageChange: setPage,
        }}
      />
    </div>
  );
}
