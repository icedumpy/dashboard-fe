import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import StatusBadge from "@/components/status-badge";
import CheckButton from "../components/check-button";
import ClassifyScrapButton from "../components/classify-scrap-button";
import ConfirmButton from "../components/confirm-button";
import StatusHistoryButton from "@/components/status-history-button";

import { DATE_TIME_FORMAT } from "@/contants/format";
import { STATION } from "@/contants/station";
import { STATUS } from "@/contants/status";

import type { StationItemType } from "@/types/station";

export const COLUMNS_ROLL: ColumnDef<StationItemType>[] = [
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
          <ConfirmButton
            status={status}
            itemId={id}
            isPendingReview={isPendingReview}
            isChangingStatusPending={isChangingStatusPending}
            stationType={STATION.ROLL}
          />
          {isClassifyScrap && <ClassifyScrapButton id={id} status={status} />}
        </div>
      );
    },
  },
];
