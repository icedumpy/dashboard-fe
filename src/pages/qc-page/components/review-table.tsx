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
// import { ALL_OPTION } from "@/contants/option";
// import { useDefectOptionAPI } from "@/hooks/option/use-defect-option";
import { useGetChangeStatus } from "@/hooks/change-status/use-get-change-status";

export default function ReviewTable() {
  const { user } = useAuth();
  const [, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [line, setLine] = useQueryState("line_id", {
    defaultValue: user?.line?.id ? String(user.line?.id) : "",
  });
  // const [defect, setDefect] = useQueryState("defect", {
  //   defaultValue: "all",
  // });
  const { data: changeStatus } = useGetChangeStatus({
    line_id: line,
  });

  const { data: lineOptions } = useProductionLineOptions();
  // const { data: defectOptions } = useDefectOptionAPI();
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
          {/* <Select value={defect} onValueChange={setDefect}>
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
          </Select> */}
        </div>
      </div>
      <DataTable
        columns={REVIEW_COLUMNS}
        data={changeStatus?.data ?? []}
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
