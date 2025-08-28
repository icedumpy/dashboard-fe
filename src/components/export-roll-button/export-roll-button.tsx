import { DownloadIcon, FileIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { useCallback } from "react";
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

import { downloadCSV } from "@/utils/download-csv";

import type { StationItemType } from "@/types/station";

interface ExportRollButtonProps {
  data: StationItemType[];
}

export default function ExportRollButton({ data }: ExportRollButtonProps) {
  const [line] = useQueryState("line", {
    defaultValue: "3",
  });

  const handleExport = useCallback(() => {
    const filename = `roll-station-line-${line}-${dayjs().format(
      "YYYY-MM-DD"
    )}.csv`;
    downloadCSV<StationItemType>(data, filename);
  }, [data, line]);

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
          <p>ยืนยันการดาวน์โหลดรายงานสำหรับ Roll Station - Line {line}</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">ยกเลิก</Button>
          </DialogClose>
          <Button onClick={handleExport}>ดาวน์โหลด</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
