import { DownloadIcon, FileIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DownloadReportParams,
  useItemReportAPI,
} from "@/hooks/item/use-item-report";
import { STATION } from "@/contants/station";
import { downloadFile } from "@/utils/download-file";
import { useLineAPI } from "@/hooks/line/use-line";

export default function ExportBundleButton({
  filters,
}: {
  filters: DownloadReportParams;
}) {
  const { data } = useLineAPI();
  const [line] = useQueryState("line", {
    defaultValue: String(data?.data[0].id),
  });

  const itemReport = useItemReportAPI();
  const handleExport = useCallback(() => {
    const filename = `bundle-station-line-${line}-${dayjs().format(
      "YYYY-MM-DD"
    )}.csv`;

    itemReport.mutate(
      { ...filters, line_id: line, station: STATION.BUNDLE },
      {
        onSuccess(data) {
          downloadFile(data, filename);
        },
      }
    );
  }, [itemReport, line, filters]);

  const getLineCode = useMemo(() => {
    return data?.data.find((item) => item.id === Number(line))?.code;
  }, [data, line]);

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
          <p>
            ยืนยันการดาวน์โหลดรายงานสำหรับ Bundle Station - Line {getLineCode}
          </p>
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
