import ExportRollButton from "../export-roll-button";
import ExportBundleButton from "../export-bundle-button";

import { ROLES } from "@/contants/auth";
import { useAuth } from "@/hooks/auth/use-auth-v2";

import type { DownloadReportParams } from "@/hooks/item/use-item-report";

export default function ReportSection({
  filters,
}: {
  filters: DownloadReportParams;
}) {
  const { user } = useAuth();

  if (user?.role != ROLES.VIEWER) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded">
      <div>
        <p className="text-lg font-bold">สร้างรายงานตามสถานี</p>
        <span className="text-sm text-muted-foreground">
          ดาวน์โหลดรายงานแยกตามประเภทสถานีการผลิต
        </span>
      </div>
      <div className="flex gap-2">
        <ExportRollButton filters={filters} />
        <ExportBundleButton filters={filters} />
      </div>
    </div>
  );
}
