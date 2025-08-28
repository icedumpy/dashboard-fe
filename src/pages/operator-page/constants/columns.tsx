import dayjs from "dayjs";
import { ColumnDef } from "@tanstack/react-table";

import CheckButton from "../components/check-button";
import StatusBadge from "@/components/status-badge";

import { DATE_TIME_FORMAT } from "@/contants/format";

import type { StationItemType } from "@/types/station";

export const COLUMNS: ColumnDef<StationItemType>[] = [
  {
    accessorKey: "product_code",
    header: "Product Code",
    meta: { className: "text-center" },
  },
  {
    accessorKey: "roll_id",
    header: "Roll ID",
    meta: { className: "text-center" },
  },
  {
    accessorKey: "roll_number",
    header: "Roll Number",
    meta: { className: "text-center" },
  },
  {
    accessorKey: "job_order_number",
    header: "Job Order Number",
    meta: { className: "text-center" },
  },
  {
    accessorKey: "roll_width",
    header: "Roll Width",
    meta: { className: "text-end" },
  },
  {
    accessorKey: "detected_at",
    header: "Time Stamp",
    meta: { className: "text-center" },
    cell: (info) => dayjs(info.getValue<string>()).format(DATE_TIME_FORMAT),
  },
  {
    accessorKey: "status_code",
    header: "Status",
    cell: (info) => (
      <StatusBadge
        status={info.getValue<string>()}
        note={info.row.original.ai_note}
      />
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div>
        <CheckButton id={row.original.id} />
      </div>
    ),
  },
];
