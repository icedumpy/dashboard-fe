import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import StatusBadge from "@/components/status-badge";
import StatusHistoryButton from "@/components/status-history-button/status-history-button";
import RollActions from "../components/roll-actions";

import { DATE_TIME_FORMAT } from "@/constants/format";

import type { StationItemType } from "@/types/station";

export const COLUMNS_BUNDLE: ColumnDef<StationItemType>[] = [
  {
    accessorKey: "product_code",
    header: "Product Code",
    enableSorting: true,
    meta: { className: "text-center" },
  },
  {
    accessorKey: "roll_id",
    header: "Roll ID",
    enableSorting: true,
    meta: { className: "text-center" },
  },
  {
    accessorKey: "roll_number",
    header: "Bundle Number",
    enableSorting: true,
    meta: { className: "text-center" },
  },
  {
    accessorKey: "job_order_number",
    header: "Job Order Number",
    enableSorting: true,
    meta: { className: "text-center" },
  },
  {
    accessorKey: "roll_width",
    header: "Roll Width",
    enableSorting: true,
    meta: { className: "text-end" },
  },
  {
    accessorKey: "detected_at",
    header: "Time Stamp",
    enableSorting: true,
    meta: { className: "text-center" },
    cell: (info) => dayjs(info.getValue<string>()).format(DATE_TIME_FORMAT),
  },
  {
    accessorKey: "status_code",
    header: "Status",
    enableSorting: true,
    cell: (info) => (
      <StatusBadge
        status={info.getValue<string>()}
        note={info.row.original.defects?.join(", ")}
      />
    ),
  },
  {
    accessorKey: "history",
    header: "History",
    cell: ({ row }) => <StatusHistoryButton itemId={row.original.id} />,
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <RollActions itemId={row.original.id} itemData={row.original} />
    ),
  },
];
