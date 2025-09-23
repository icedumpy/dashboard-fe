import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import StatusBadge from "@/components/status-badge";
import CheckButton from "../components/check-button";
import ClassifyScrapButton from "../components/classify-scrap-button";
import StatusHistoryButton from "@/components/status-history-button";

import { DATE_TIME_FORMAT } from "@/constants/format";
import { STATION } from "@/constants/station";
import { STATUS } from "@/constants/status";

import type { StationItemType } from "@/types/station";

export const COLUMNS_ROLL: ColumnDef<StationItemType>[] = [
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
    header: "Roll Number",
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
    cell: ({ row }) => {
      const id = row.original.id;
      const status = row.original
        ?.status_code as StationItemType["status_code"];
      const isPendingReview = row.original?.is_pending_review;
      const isClassifyScrap = status === STATUS.RECHECK;
      const isChangingStatusPending = row.original?.is_changing_status_pending;
      return (
        <div className="flex items-center gap-2">
          {id && (
            <CheckButton
              itemId={id}
              status={status}
              isPendingReview={isPendingReview}
              itemData={row.original}
              stationType={STATION.ROLL}
              isChangingStatusPending={isChangingStatusPending}
            />
          )}
          {isClassifyScrap && <ClassifyScrapButton id={id} status={status} />}
        </div>
      );
    },
  },
];
