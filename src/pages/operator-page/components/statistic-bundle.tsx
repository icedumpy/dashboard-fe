import { cn } from "@/lib/utils";

import type { ItemSummaryResponse } from "@/types/item";

export default function StatisticBundle({
  data,
}: {
  data?: ItemSummaryResponse["bundle"];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <div
        className={cn(
          "p-2 border rounded text-center flex-1 min-w-[120px] bg-gray-50"
        )}
      >
        <p className="text-xl font-bold">{data?.total}</p>
        <span className="text-sm">จำนวน Bundle ทั้งหมดในกะนี้</span>
      </div>
      <div
        className={cn(
          "p-2 border rounded text-center flex-1 min-w-[120px",
          "bg-orange-50 border-orange-200 text-orange-800"
        )}
      >
        <p className="text-xl font-bold">{data?.defects}</p>
        <span className="text-sm">จำนวน Defect ทั้งหมดในกะนี้</span>
      </div>
      <div
        className={cn(
          "p-2 border rounded text-center flex-1 min-w-[120px",
          "bg-red-50 border-red-200 text-red-800"
        )}
      >
        <p className="text-xl font-bold">{data?.scrap}</p>
        <span className="text-sm">จำนวน Scrap ทั้งหมดในกะนี้</span>
      </div>
      <div
        className={cn(
          "p-2 border rounded text-center flex-1 min-w-[120px",
          "bg-orange-100 border-orange-300 text-orange-700"
        )}
      >
        <p className="text-xl font-bold">{data?.pending_defect}</p>
        <span className="text-sm">จำนวน Defect ที่รอการตรวจสอบ</span>
      </div>
      <div
        className={cn(
          "p-2 border rounded text-center flex-1 min-w-[120px",
          "bg-red-100 border-red-300 text-red-700"
        )}
      >
        <p className="text-xl font-bold">{data?.pending_scrap}</p>
        <span className="text-sm">จำนวน Scrap ที่รอการตรวจสอบ</span>
      </div>
    </div>
  );
}
