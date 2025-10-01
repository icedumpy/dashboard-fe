import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import StatusBadge from "@/components/status-badge";
import ReviewedBy from "../components/reviewed-by";
import ActionButton from "../components/action-button";
import StatusHistoryButton from "@/components/status-history-button";
import ProductionLineCode from "../components/production-line-code";

import { DATE_TIME_FORMAT } from "@/constants/format";

import type { ReviewT } from "@/types/review";

export const HISTORY_COLUMNS: ColumnDef<ReviewT>[] = [
  {
    accessorKey: "production_line",
    header: "Production Line",
    enableSorting: true,
    meta: { className: "text-center" },
    cell: (info) => <ProductionLineCode id={info.row.original.item.line_id} />,
  },
  {
    accessorKey: "station",
    header: "Station",
    enableSorting: true,
    meta: { className: "text-center" },
    cell: (info) => info.row.original.item.station,
  },
  {
    accessorKey: "product_code",
    header: "Product Code",
    enableSorting: true,
    meta: { className: "text-center" },
    cell: (info) => info.row.original.item.product_code,
  },
  {
    accessorKey: "number",
    header: "Roll/Bundle Number",
    enableSorting: true,
    meta: { className: "text-center" },
    cell: (info) => info.row.original.item.number,
  },
  {
    accessorKey: "job_order_number",
    header: "Job Order Number",
    enableSorting: true,
    meta: { className: "text-center" },
    cell: (info) => info.row.original.item.job_order_number,
  },
  {
    accessorKey: "state",
    header: "Status",
    enableSorting: true,
    meta: { className: "text-start" },
    cell: (info) => (
      <StatusBadge
        status={info.row.original.item.status.code}
        note={info.row.original.defects
          ?.map((defect) => defect.defect_type_name)
          ?.join(", ")}
      />
    ),
  },
  {
    accessorKey: "decision",
    header: "Decision",
    enableSorting: true,
    cell: ({ row }) => (
      <p className="max-w-md break-words min-w-fit text-wrap line-clamp-2">
        {row.original.decision_note}
      </p>
    ),
  },
  {
    accessorKey: "reviewed_by",
    header: "Reviewed By",
    enableSorting: true,
    meta: { className: "text-center" },
    cell: (info) => <ReviewedBy itemId={info.row.original.item.id} />,
  },
  {
    accessorKey: "reviewed_at",
    header: "Reviewed At",
    enableSorting: true,
    meta: { className: "text-center" },
    cell: (info) =>
      info.getValue<string>() &&
      dayjs(info.getValue<string>()).format(DATE_TIME_FORMAT),
  },
  {
    accessorKey: "history",
    header: "History",
    cell: ({ row }) => <StatusHistoryButton itemId={row.original.item.id} />,
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
