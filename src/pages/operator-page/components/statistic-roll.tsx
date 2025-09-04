import { cn } from "@/lib/utils";

import type { StationResponse } from "@/types/station";

export default function StatisticRoll({
  data,
}: {
  data?: StationResponse["summary"];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <div
        className={cn(
          "min-w-[120px] p-2 border rounded text-center flex-1 bg-gray-50"
        )}
      >
        <p className="text-xl font-bold">{data?.total ?? 0}</p>
        <span className="text-xs">จำนวน Roll ทั้งหมดในกะนี้</span>
      </div>
      <div
        className={cn(
          "min-w-[120px] p-2 border rounded text-center flex-1 min-w-[120px",
          "bg-orange-50 border-orange-200 text-orange-800"
        )}
      >
        <p className="text-xl font-bold">{data?.defects ?? 0}</p>
        <span className="text-xs">จำนวน Defect ทั้งหมดในกะนี้</span>
      </div>
      <div
        className={cn(
          "min-w-[120px] p-2 border rounded text-center flex-1 min-w-[120px",
          "bg-red-50 border-red-200 text-red-800"
        )}
      >
        <p className="text-xl font-bold">{data?.scrap ?? 0}</p>
        <span className="text-xs">จำนวน Scrap ทั้งหมดในกะนี้</span>
      </div>
      <div
        className={cn(
          "min-w-[120px] p-2 border rounded text-center flex-1 min-w-[120px",
          "bg-orange-100 border-orange-300 text-orange-700"
        )}
      >
        <p className="text-xl font-bold">{data?.pending_defect ?? 0}</p>
        <span className="text-xs">จำนวน Defect ที่รอการตรวจสอบ</span>
      </div>
      {/* <div
        className={cn(
          "min-w-[120px] p-2 border rounded text-center flex-1 min-w-[120px",
          "bg-red-100 border-red-300 text-red-700"
        )}
      >
        <p className="text-xl font-bold">{data?.pending_scrap ?? 0}</p>
        <span className="text-xs">จำนวน Scrap ที่รอการตรวจสอบ</span>
      </div> */}
    </div>
  );
}
