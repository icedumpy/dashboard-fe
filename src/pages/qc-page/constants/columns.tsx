import { ColumnDef } from "@tanstack/react-table";
import { CheckIcon, EyeIcon, XIcon } from "lucide-react";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/status-badge";

import { DATE_TIME_FORMAT } from "@/contants/format";

import type { StationItemType } from "@/types/station";

export const COLUMNS: ColumnDef<StationItemType>[] = [
  {
    accessorKey: "line_id",
    header: "Production Line",
    meta: { className: "text-center" },
  },
  {
    accessorKey: "station",
    header: "Station",
    meta: { className: "text-center" },
  },
  {
    accessorKey: "product_code",
    header: "Product Code",
    meta: { className: "text-center" },
  },
  {
    accessorKey: "roll_number",
    header: "Roll/Bundle Number",
    meta: { className: "text-center" },
  },
  {
    accessorKey: "job_order_number",
    header: "Job Order Number",
    meta: { className: "text-center" },
  },
  {
    accessorKey: "detected_at",
    header: "Timestamp",
    meta: { className: "text-center" },
    cell: (info) => dayjs(info.getValue<string>()).format(DATE_TIME_FORMAT),
  },
  {
    accessorKey: "status_code",
    header: "Status",
    meta: { className: "text-start" },
    cell: (info) => (
      <StatusBadge
        status={info.getValue<string>()}
        note={info.row.original.ai_note}
      />
    ),
  },
  {
    accessorKey: "id",
    header: "Action",
    meta: { className: "text-center" },
    cell: () => (
      <div className="flex gap-2">
        <Button className="size-8 text-primary" variant="secondary">
          <EyeIcon />
        </Button>
        <Button className="text-green-600 size-8" variant="secondary">
          <CheckIcon />
        </Button>
        <Button className="text-orange-600 size-8" variant="secondary">
          <XIcon />
        </Button>
      </div>
    ),
  },
];
