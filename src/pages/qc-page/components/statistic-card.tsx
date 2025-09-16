import { CheckIcon, LineChartIcon, XIcon } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";

import { useAuth } from "@/hooks/auth/use-auth-v2";
import { useReviewAPI } from "@/hooks/review/use-review";
import { TABS, TABS_KEYS } from "../constants/tabs";
import { useGetChangeStatus } from "@/hooks/change-status/use-get-change-status";

export default function StatisticCard() {
  const { user } = useAuth();
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [line] = useQueryState("line", {
    defaultValue: user?.line?.id ? String(user.line?.id) : "",
  });
  const [defect] = useQueryState("defect", {
    defaultValue: "",
  });
  const [tabs] = useQueryState("tabs", {
    defaultValue: TABS[0].value,
  });

  const { data } = useReviewAPI({
    page: page,
    line_id: line,
    defect_type_id: defect,
  });

  const { data: changeStatusData } = useGetChangeStatus({
    line_id: line,
  });

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 min-w-3xs">
      {tabs === TABS_KEYS.STATUS_REVIEW ? (
        <>
          <div className="w-full p-4 bg-[#FEF6EC] border border-[#FFE1BC] text-[#951800] rounded-md min-w-3xs">
            <div className="flex items-center justify-center text-center">
              <div className="space-y-2">
                <p className="text-3xl font-bold">
                  {changeStatusData?.summary.roll ?? 0}
                </p>
                <p className="text-sm">จำนวน Roll ถูกแก้ไขสถานะ</p>
              </div>
            </div>
          </div>
          <div className="w-full p-4 bg-[#FAF6FF] border border-[#CE9FFEC4] text-[#473757] rounded-md min-w-3xs">
            <div className="flex items-center justify-center text-center">
              <div className="space-y-2">
                <p className="text-3xl font-bold">
                  {changeStatusData?.summary.bundle ?? 0}
                </p>
                <p className="text-sm">จำนวน Bundle ถูกแก้ไขสถานะ</p>
              </div>
            </div>
          </div>
          <div className="w-full p-4 bg-[#FEF2F2] border border-[#95180069] text-[#940003] rounded-md min-w-3xs">
            <div className="flex items-center justify-center text-center">
              <div className="space-y-2">
                <p className="text-3xl font-bold">
                  {changeStatusData?.summary.total ?? 0}
                </p>
                <p className="text-sm">จำนวนชิ้นงานถูกแก้สถานะกลับ</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-full p-4 bg-white border rounded-md min-w-3xs">
            <div className="flex items-center justify-between">
              <div>
                <p>รอการตรวจสอบ</p>
                <p className="text-3xl font-bold">
                  {data?.summary?.pending ?? 0}
                </p>
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
                <p className="text-3xl font-bold">
                  {data?.summary?.approved ?? 0}
                </p>
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
                <p className="text-3xl font-bold">
                  {data?.summary?.rejected ?? 0}
                </p>
              </div>
              <div className="flex items-center justify-center text-red-600 rounded size-12 bg-red-600/10">
                <XIcon />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
