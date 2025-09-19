import { parseAsInteger, useQueryState } from "nuqs";

import DataTable from "@/components/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useProductionLineOptions } from "@/hooks/option/use-production-line-option";
import { HISTORY_COLUMNS } from "../constants/history-columns";
import { useAuth } from "@/hooks/auth/use-auth-v2";
import { useDefectOptionAPI } from "@/hooks/option/use-defect-option";
import { useReviewAPI } from "@/hooks/review/use-review";
import { REVIEW_STATE_OPTION, REVIEW_STATE } from "@/contants/review";
import { ALL_OPTION } from "@/contants/option";

import type { ReviewStateT } from "@/types/review";

export default function ReviewHistoryTable() {
  const { user } = useAuth();
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [line, setLine] = useQueryState("line_id", {
    defaultValue: user?.line?.id ? String(user.line?.id) : "",
  });
  const [defect, setDefect] = useQueryState("defect", {
    defaultValue: "all",
  });
  const [reviewState, setReviewState] = useQueryState("review-state", {
    defaultValue: "all",
  });

  const { data: lineOptions } = useProductionLineOptions();
  const { data: defectOptions } = useDefectOptionAPI();
  const { data } = useReviewAPI({
    page: page,
    line_id: line,
    review_state:
      reviewState === "all"
        ? [REVIEW_STATE.REJECTED, REVIEW_STATE.APPROVED]
        : ([reviewState] as ReviewStateT[]),
    defect_type_id: defect === "all" ? undefined : defect,
  });

  return (
    <div className="p-4 space-y-3 bg-white border rounded-md">
      <div className="flex justify-between gap-2">
        <p>ประวัติการตรวจสอบ</p>
        <div className="flex justify-between gap-2">
          <Select value={reviewState} onValueChange={setReviewState}>
            <SelectTrigger className="w-30">
              <SelectValue placeholder="เลือกการตรวจสอบ" />
            </SelectTrigger>
            <SelectContent>
              {REVIEW_STATE_OPTION.filter(
                (item) => item.value != REVIEW_STATE.PENDING
              )?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Select
            value={defect}
            onValueChange={(value) => {
              setPage(1);
              setDefect(value);
            }}
          >
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
        columns={HISTORY_COLUMNS}
        data={data?.data ?? []}
        pagination={{
          ...data?.pagination,
          onPageChange: setPage,
        }}
      />
    </div>
  );
}
