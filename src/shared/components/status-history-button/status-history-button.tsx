import dayjs from 'dayjs';
import { useCallback, useState } from 'react';

import DataTable from '@/shared/components/data-table';
import StatusBadge from '@/shared/components/status-badge';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';

import { DATE_TIME_FORMAT } from '@/shared/constants/format';
import { useItemStatusHistory } from '@/shared/hooks/item/use-item-status-history';

import type { ItemStatusHistoryT } from '@/shared/types/item';
import type { ColumnDef } from '@tanstack/react-table';

export default function StatusHistoryButton({ itemId }: { itemId: number }) {
  const [open, setOpen] = useState(false);
  const {
    data: statusHistory,
    isLoading,
    refetch,
  } = useItemStatusHistory(String(itemId));

  const columns: ColumnDef<ItemStatusHistoryT>[] = [
    {
      accessorKey: 'from_status_code',
      header: 'ก่อนหน้า',
      meta: { className: 'text-start' },
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.from_status_code}
          note={row.original.before_defects?.join(', ')}
        />
      ),
    },
    {
      accessorKey: 'to_status_code',
      header: 'หลังจากนั้น',
      meta: { className: 'text-start' },
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.to_status_code}
          note={row.original.defects?.join(', ')}
        />
      ),
    },
    {
      accessorKey: 'actor',
      header: 'ผู้ดำเนินการ',
      cell: ({ row }) => row.original.actor.display_name,
      meta: { className: 'text-start' },
    },
    {
      accessorKey: 'created_at',
      header: 'แก้ไขเมื่อ',
      cell: info => dayjs(info.getValue<string>()).format(DATE_TIME_FORMAT),
      meta: { className: 'text-center' },
    },
  ];

  const handleOnOpen = useCallback(
    async (open: boolean) => {
      if (open) {
        await refetch();
      }
      setOpen(open);
    },
    [open],
  );

  return (
    <Dialog open={open} onOpenChange={handleOnOpen}>
      <DialogTrigger asChild>
        <Button size="xs" variant="outline">
          ประวัติการแก้ไข
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="md:min-w-2xl">
        <DialogHeader>
          <DialogTitle>ประวัติการแก้ไขสถานะ</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto">
          <DataTable
            isLoading={isLoading}
            columns={columns}
            data={statusHistory ?? []}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              ปิด
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
