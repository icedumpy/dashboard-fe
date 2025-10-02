import { cn } from "@/lib/utils";

import type { ItemResponse } from "@/types/item";

export default function StatisticCards({
  data,
}: {
  data?: ItemResponse["summary"];
}) {
  const summary = {
    normal: 0,
    qc_passed: 0,
    defect: 0,
    scrap: 0,
    rejected: 0,
    pending_defect: 0,
    ...data,
  };

  const normalQC_Passed = summary.normal + summary.qc_passed;
  const defects = summary.defect;
  const scrap = summary.scrap + summary.rejected;
  const pending_defect = summary.pending_defect;

  return (
    <div className="flex flex-wrap gap-2">
      <div
        className={cn(
          "min-w-[120px] p-2 py-4 border rounded text-center flex-1 border-[#B9F8CF] bg-[#DBFCE7] text-[#246630] grid place-content-center"
        )}
      >
        <p className="text-2xl font-bold">{normalQC_Passed}</p>
        <span className="text-xs">จำนวนงานดีทั้งหมด (Normal,QC Passed)</span>
      </div>
      <div
        className={cn(
          "min-w-[120px] p-2 border rounded text-center flex-1 grid place-content-center",
          "bg-orange-50 border-orange-200 text-orange-800"
        )}
      >
        <p className="text-2xl font-bold">{defects}</p>
        <span className="text-xs">จำนวน Defect ทั้งหมด</span>
      </div>
      <div
        className={cn(
          "min-w-[120px] p-2 border rounded text-center flex-1 grid place-content-center",
          "bg-red-50 border-red-200 text-red-800"
        )}
      >
        <p className="text-2xl font-bold">{scrap}</p>
        <span className="text-xs">จำนวนของเสียทั้งหมด (Scrap,Rejected)</span>
      </div>
      <div
        className={cn(
          "min-w-[120px] p-2 border rounded text-center flex-1 grid place-content-center",
          "bg-orange-100 border-orange-300 text-orange-700"
        )}
      >
        <p className="text-2xl font-bold">{pending_defect}</p>
        <span className="text-xs">จำนวน Defect ที่รอการตรวจสอบ</span>
      </div>
    </div>
  );
}
