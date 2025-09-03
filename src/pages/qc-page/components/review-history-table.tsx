import DataTable from "@/components/data-table";
import { COLUMNS } from "../constants/history-columns";
import { useAuth } from "@/hooks/auth/use-auth-v2";
import { parseAsInteger, useQueryState } from "nuqs";
import { useProductionLineOptions } from "@/hooks/option/use-production-line-option";
import { useDefectOptionAPI } from "@/hooks/option/use-defect-option";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useReviewAPI } from "@/hooks/review/use-review";
import { REVIEW_STATE_OPTION, REVIEW_STATE } from "@/contants/review";
import { ALL_OPTION } from "@/contants/option";

export default function ReviewHistoryTable() {
  const { user } = useAuth();
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [line, setLine] = useQueryState("line", {
    defaultValue: user?.line?.id ? String(user.line?.id) : "",
  });
  const [defect, setDefect] = useQueryState("defect", {
    defaultValue: "all",
  });
  const [state, setState] = useQueryState("state", {
    defaultValue: "all",
  });

  const { data: lineOptions } = useProductionLineOptions();
  const { data: defectOptions } = useDefectOptionAPI();
  const { data } = useReviewAPI({
    page: page,
    line_id: line,
    defect_type_id: defect === "all" ? undefined : defect,
    review_state:
      state === "all"
        ? undefined
        : (state as (typeof REVIEW_STATE)[keyof typeof REVIEW_STATE]),
  });
  return (
    <div className="p-4 space-y-3 bg-white border rounded-md">
      <div className="flex justify-between gap-2">
        <p>ประวัติการตรวจสอบ</p>
        <div className="flex justify-between gap-2">
          <Select value={state} onValueChange={setState}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="เลือกการตรวจสอบ" />
            </SelectTrigger>
            <SelectContent>
              {REVIEW_STATE_OPTION?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
