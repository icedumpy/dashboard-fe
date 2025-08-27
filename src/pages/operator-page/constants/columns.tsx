import dayjs from "dayjs";
import { ColumnDef } from "@tanstack/react-table";

import { DATE_TIME_FORMAT } from "@/contants/format";

import type { StationItemType } from "@/types/station";

export const COLUMNS: ColumnDef<StationItemType>[] = [
  {
    accessorKey: "product_code",
    header: "Product Code",
    meta: { className: "text-center" },
  },
  {
    accessorKey: "job_order_number",
    header: "Roll Number",
    meta: { className: "text-center" },
  },
  {
    accessorKey: "roll_width",
    header: "Roll Width",
    meta: { className: "text-center" },
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
    meta: { className: "text-center" },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: () => "TODO",
  },
];
