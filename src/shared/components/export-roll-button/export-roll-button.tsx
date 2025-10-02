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

export default function ExportRollButton({
  filters,
}: {
  filters: DownloadReportParams;
}) {
  const { data } = useLineAPI();
  const itemReport = useItemReportAPI();
  const lineCode = getLineCode(Number(filters.line_id), data?.data);
  const handleExport = useCallback(() => {
    const filename = `roll-station-line-${lineCode}-${dayjs().format(
      "YYYY-MM-DD"
    )}.csv`;

    itemReport.mutate(
      { ...filters, line_id: filters.line_id, station: STATION.ROLL },
      {
        onSuccess(data) {
          downloadFile(data, filename);
        },
      }
    );
  }, [filters, itemReport, lineCode]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-500">
          <DownloadIcon /> สร้างรายงาน Roll
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>ส่งออกรายงาน Roll Station</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid rounded-full size-10 place-content-center bg-primary/20 text-primary">
            <FileIcon className="size-4" />
          </div>
          <p>ยืนยันการดาวน์โหลดรายงานสำหรับ Roll Station - Line {lineCode}</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              ยกเลิก
            </Button>
          </DialogClose>
          <Button onClick={handleExport} disabled={itemReport.isPending}>
            ดาวน์โหลด
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
