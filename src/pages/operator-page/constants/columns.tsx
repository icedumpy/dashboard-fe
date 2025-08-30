import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';

import StatusBadge from '@/components/status-badge';
import CheckButton from '../components/check-button';
import ClassifyScrapButton from '../components/classify-scrap-button';
import ConfirmButton from '../components/confirm-button';

import { DATE_TIME_FORMAT } from '@/contants/format';
import { STATION_STATUS } from '@/contants/station';

import type { StationItemType } from '@/types/station';

export const COLUMNS: ColumnDef<StationItemType>[] = [
  {
    accessorKey: 'product_code',
    header: 'Product Code',
    meta: { className: 'text-center' },
  },
  {
    accessorKey: 'roll_id',
    header: 'Roll ID',
    meta: { className: 'text-center' },
  },
  {
    accessorKey: 'roll_number',
    header: 'Roll Number',
    meta: { className: 'text-center' },
  },
  {
    accessorKey: 'job_order_number',
    header: 'Job Order Number',
    meta: { className: 'text-center' },
  },
  {
    accessorKey: 'roll_width',
    header: 'Roll Width',
    meta: { className: 'text-end' },
  },
  {
    accessorKey: 'detected_at',
    header: 'Time Stamp',
    meta: { className: 'text-center' },
    cell: info => dayjs(info.getValue<string>()).format(DATE_TIME_FORMAT),
  },
  {
    accessorKey: 'status_code',
    header: 'Status',
    cell: info => {
      const row = info.row.original;
      const defectsBadges = row.defects.map(def => (
        <StatusBadge status={row.status_code} note={def} />
      ));
      const normalBadge = <StatusBadge status={row.status_code} />;
      const rejectedBadge = [
        <StatusBadge status={row.status_code} note="ยังคงเห็น Defect อยู่" />,
        ...row.defects.map(def => <StatusBadge status={'DEFECT'} note={def} />),
      ];

      return row.status_code == 'DEFECT'
        ? defectsBadges
        : row.status_code == 'REJECTED'
        ? rejectedBadge
        : normalBadge;
    },
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => {
      const id = row.original.id;
      const status = row.original
        ?.status_code as StationItemType['status_code'];
      const is_pending_review = row.original?.is_pending_review;

      const isClassifyScrap = status === STATION_STATUS.RECHECK;
      return (
        <div className="flex items-center gap-2">
          {id && (
            <CheckButton
              id={id}
              status={status}
              is_pending_review={is_pending_review}
              item_data={row.original}
            />
          )}
          <ConfirmButton
            status={status}
            id={id}
            is_pending_review={is_pending_review}
          />
          {isClassifyScrap && <ClassifyScrapButton id={id} status={status} />}
        </div>
      );
    },
  },
];
