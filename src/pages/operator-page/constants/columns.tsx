import dayjs from "dayjs";
import { ColumnDef } from "@tanstack/react-table";

import type { StationItemType } from "@/types/station";
import { DATE_TIME_FORMAT } from "@/contants/format";

export const COLUMNS: ColumnDef<StationItemType>[] = [
  {
    accessorKey: "product_code",
    header: "Product Code",
  },
  {
    accessorKey: "job_order_number",
    header: "Roll Number",
  },
  {
    accessorKey: "roll_width",
    header: "Roll Width",
  },
  {
    accessorKey: "detected_at",
    header: "Time Stamp",
    cell: (info) => dayjs(info.getValue<string>()).format(DATE_TIME_FORMAT),
  },
  {
    accessorKey: "status_code",
    header: "Status",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: () => "TODO",
  },
];
