import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import StatusBadge from "@/components/status-badge";
import ActionButton from "../components/action-button";
import StatusHistoryButton from "@/components/status-history-button";

import { DATE_TIME_FORMAT } from "@/contants/format";

import type { ReviewT } from "@/types/review";

export const COLUMNS: ColumnDef<ReviewT>[] = [
  {
    accessorKey: "line_id",
    header: "Production Line",
    meta: { className: "text-center" },
    cell: (info) => info.row.original.item.line_id,
  },
  {
    accessorKey: "station",
    header: "Station",
    meta: { className: "text-center" },
    cell: (info) => info.row.original.item.station,
  },
  {
    accessorKey: "product_code",
    header: "Product Code",
    meta: { className: "text-center" },
    cell: (info) => info.row.original.item.product_code,
  },
  {
    accessorKey: "roll_number",
    header: "Roll/Bundle Number",
    meta: { className: "text-center" },
    cell: (info) => info.row.original.item.number,
  },
  {
    accessorKey: "job_order_number",
    header: "Job Order Number",
    meta: { className: "text-center" },
    cell: (info) => info.row.original.item.job_order_number,
  },
  {
    accessorKey: "detected_at",
    header: "Timestamp",
    meta: { className: "text-center" },
    cell: (info) =>
      dayjs(info.row.original.submitted_at).format(DATE_TIME_FORMAT),
  },
  {
    accessorKey: "status_code",
    header: "Status",
    meta: { className: "text-start" },
    cell: (info) => (
      <StatusBadge
        status={String(info.row.original.item.status.code)}
        note={info.row.original.defects
          .map((defect) => defect.defect_type_name)
          .join(", ")}
      />
    ),
  },
  {
    accessorKey: "history",
    header: "History",
    cell: ({ row }) => <StatusHistoryButton itemId={row.original.id} />,
  },
  {
    accessorKey: "id",
    header: "Action",
    meta: { className: "text-center" },
    cell: (info) => (
      <ActionButton
        itemId={String(info.row?.original?.item?.id)}
        reviewId={String(info.row?.original?.id)}
      />
    ),
  },
];
