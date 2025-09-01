import { useMemo } from "react";
import { CheckIcon, LineChartIcon, XIcon } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";

import { useAuth } from "@/hooks/auth/use-auth-v2";
import { useReviewAPI } from "@/hooks/review/use-review";
import { REVIEW_STATE } from "@/contants/review";

export default function StatisticCard() {
  const { user } = useAuth();
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [line] = useQueryState("line", {
    defaultValue: user?.line?.id ? String(user.line?.id) : "",
  });
  const [defect] = useQueryState("defect", {
    defaultValue: "",
  });

  const { data } = useReviewAPI({
    page: page,
    line_id: line,
    status: REVIEW_STATE.PENDING,
    defect_type_id: defect,
  });

  const getPendingCount = useMemo(() => {
    return (
      data?.data.filter((item) => item.state === REVIEW_STATE.PENDING).length ||
      "-"
    );
  }, [data]);

  const getApprovedCount = useMemo(() => {
    return (
      data?.data.filter((item) => item.state === REVIEW_STATE.APPROVED)
        .length || "-"
    );
  }, [data]);

  const getRejectedCount = useMemo(() => {
    return (
      data?.data.filter((item) => item.state === REVIEW_STATE.REJECTED)
        .length || "-"
    );
  }, [data]);

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 min-w-3xs">
      <div className="w-full p-4 bg-white border rounded-md min-w-3xs">
        <div className="flex items-center justify-between">
          <div>
            <p>รอการตรวจสอบ</p>
            <p className="text-3xl font-bold">{getPendingCount}</p>
          </div>
          <div>
            <div className="flex items-center justify-center rounded size-12 bg-primary/10 text-primary">
              <LineChartIcon />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full p-4 bg-white border rounded-md min-w-3xs">
        <div className="flex items-center justify-between">
          <div>
            <p>อนุมัติ</p>
            <p className="text-3xl font-bold">{getApprovedCount}</p>
          </div>
          <div className="flex items-center justify-center text-green-600 rounded size-12 bg-green-600/10">
            <CheckIcon />
          </div>
        </div>
      </div>
      <div className="w-full p-4 bg-white border rounded-md min-w-3xs">
        <div className="flex items-center justify-between">
          <div>
            <p>ปฏิเสธ</p>
            <p className="text-3xl font-bold">{getRejectedCount}</p>
          </div>
          <div className="flex items-center justify-center text-red-600 rounded size-12 bg-red-600/10">
            <XIcon />
          </div>
        </div>
      </div>
    </div>
  );
}
