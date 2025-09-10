import dayjs from "dayjs";
import { useState } from "react";

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
import StatusBadge from "@/components/status-badge";

import { DATE_TIME_FORMAT } from "@/contants/format";
import { useItemStatusHistory } from "@/hooks/item/use-item-status-history";

import type { ColumnDef } from "@tanstack/react-table";
import type { ItemStatusHistoryT } from "@/types/station";

export default function StatusHistoryButton({ itemId }: { itemId?: number }) {
  const [open, setOpen] = useState(false);
  const { data: statusHistory } = useItemStatusHistory(String(itemId), {
    enabled: open && Boolean(itemId),
  });

  const columns: ColumnDef<ItemStatusHistoryT>[] = [
    {
      accessorKey: "from_status_code",
      header: "ก่อนหน้า",
      meta: { className: "text-start" },
      cell: ({ row }) => <StatusBadge status={row.original.from_status_code} />,
    },
    {
      accessorKey: "to_status_code",
      header: "หลังจากนั้น",
      meta: { className: "text-start" },
      cell: ({ row }) => <StatusBadge status={row.original.to_status_code} />,
    },
    {
      accessorKey: "actor",
      header: "ผู้ดำเนินการ",
      cell: ({ row }) => row.original.actor.display_name,
      meta: { className: "text-start" },
    },
    {
      accessorKey: "created_at",
      header: "แก้ไขเมื่อ",
      cell: (info) => dayjs(info.getValue<string>()).format(DATE_TIME_FORMAT),
      meta: { className: "text-center" },
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button size="xs" variant="outline">
          ประวัติการแก้ไข
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="md:min-w-2xl">
        <DialogHeader>
          <DialogTitle>
            ประวัติการแก้ไขสถานะ {itemId ? `#${itemId}` : ""}
          </DialogTitle>
        </DialogHeader>
        <div>
          <DataTable columns={columns} data={statusHistory ?? []} />
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
