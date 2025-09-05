import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import StatusBadge from "@/components/status-badge";
import ReviewedBy from "../components/reviewed-by";
import ActionButton from "../components/action-button";

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
    accessorKey: "number",
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
    accessorKey: "status",
    header: "Status",
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
    accessorKey: "decision_note",
    header: "Decision",
    meta: { className: "text-center" },
  },
  {
    accessorKey: "reviewed_by",
    header: "Reviewed By",
    meta: { className: "text-center" },
    cell: (info) => <ReviewedBy itemId={info.row.original.item.id} />,
  },
  {
    accessorKey: "reviewed_at",
    header: "Reviewed At",
    meta: { className: "text-center" },
    cell: (info) =>
      info.getValue<string>() &&
      dayjs(info.getValue<string>()).format(DATE_TIME_FORMAT),
  },
  {
    accessorKey: "id",
    header: "Action",
    meta: { className: "text-center" },
    cell: (info) => (
      <ActionButton
        reviewId={info.getValue<string>()}
        itemId={String(info.row.original.item.id)}
      />
    ),
  },
];
