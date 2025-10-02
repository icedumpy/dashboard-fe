import { DownloadIcon, FileIcon } from "lucide-react";
import { useCallback } from "react";
import dayjs from "dayjs";

import { Button } from "@/shared/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

import {
  DownloadReportParams,
  useItemReportAPI,
} from "@/shared/hooks/item/use-item-report";
import { STATION } from "@/shared/constants/station";
import { downloadFile } from "@/shared/utils/download-file";
import { useLineAPI } from "@/shared/hooks/line/use-line";
import { getLineCode } from "@/shared/helpers/item";

export default function ExportBundleButton({
  filters,
}: {
  filters: DownloadReportParams;
}) {
  const { data } = useLineAPI();
  const itemReport = useItemReportAPI();
  const lineCode = getLineCode(Number(filters.line_id), data?.data);
  const handleExport = useCallback(() => {
    const filename = `bundle-station-line-${lineCode}-${dayjs().format(
      "YYYY-MM-DD"
    )}.csv`;

    itemReport.mutate(
      {
        ...filters,
        line_id: filters.line_id,
        station: STATION.BUNDLE,
        detected_from: filters.detected_from
          ? dayjs(filters.detected_from).toISOString()
          : undefined,
        detected_to: filters.detected_to
          ? dayjs(filters.detected_to).toISOString()
          : undefined,
      },
      {
        onSuccess(data) {
          downloadFile(data, filename);
        },
      }
    );
  }, [lineCode, itemReport, filters]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-violet-600 hover:bg-violet-500">
          <DownloadIcon /> สร้างรายงาน Bundle
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>ส่งออกรายงาน Bundle Station</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid rounded-full size-10 place-content-center bg-primary/20 text-primary">
            <FileIcon className="size-4" />
          </div>
          <p>ยืนยันการดาวน์โหลดรายงานสำหรับ Bundle Station - Line {lineCode}</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              ยกเลิก
            </Button>
          </DialogClose>
          <Button onClick={handleExport}>ดาวน์โหลด</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
