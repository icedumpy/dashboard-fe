import dayjs from "dayjs";

import DataTable from "@/components/data-table";
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
import { DATE_TIME_FORMAT } from "@/contants/format";

import type { ColumnDef } from "@tanstack/react-table";

interface StatusHistoryItem {
  before: string;
  after: string;
  updated_by: string;
  updated_at: string;
}

export default function StatusHistoryButton({ itemId }: { itemId?: number }) {
  const columns: ColumnDef<StatusHistoryItem>[] = [
    {
      accessorKey: "before",
      header: "ก่อนหน้า",
    },
    {
      accessorKey: "after",
      header: "หลังจากนั้น",
    },
    {
      accessorKey: "updated_by",
      header: "ผู้ดำเนินการ",
    },
    {
      accessorKey: "updated_at",
      header: "แก้ไขเมื่อ",
      cell: (info) => dayjs(info.getValue<string>()).format(DATE_TIME_FORMAT),
    },
  ];

  const MOCK_DATA = [
    {
      before: "รอการตรวจสอบ",
      after: "ตรวจสอบแล้ว",
      updated_by: "Fadlan",
      updated_at: "2024-06-20 10:00:00",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger>
        <Button size="xs" variant="outline">
          ประวัติการแก้ไข
        </Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-2xl">
        <DialogHeader>
          <DialogTitle>
            ประวัติการแก้ไขสถานะ {itemId ? `#${itemId}` : ""}
          </DialogTitle>
        </DialogHeader>
        <div>
          <DataTable columns={columns} data={MOCK_DATA} />
        </div>
        <DialogFooter>
          <DialogClose>
            <Button>ปิด</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
