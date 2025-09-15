import ViewDetailButton from "../components/view-detail-button";
import StatusBadge from "@/components/status-badge";
import ReviewApproveButton from "../components/review-approve-button";
import ReviewRejectButton from "../components/review-reject-button";

import type { ColumnDef } from "@tanstack/react-table";
import type { ReviewT } from "@/types/review";
import type { StatusT } from "@/types/status";

export const REVIEW_COLUMNS: ColumnDef<ReviewT>[] = [
  { accessorKey: "line_id", header: "Production Line" },
  { accessorKey: "station", header: "Station" },
  {
    accessorKey: "product_code",
    header: "Product Code",
    meta: { className: "text-center" },
    cell: (info) => info.row.original.item?.product_code,
  },
  {
    accessorKey: "roll_number",
    header: "Roll/Bundle Number",
    meta: { className: "text-center" },
    cell: (info) => info.row.original.item?.number,
  },
  {
    accessorKey: "job_order_number",
    header: "Job Order Number",
    meta: { className: "text-center" },
    cell: (info) => info.row.original.item?.job_order_number,
  },
  {
    accessorKey: "status_from",
    header: "Status Before",
    cell: (info) => <StatusBadge status={info.getValue() as StatusT} />,
  },
  {
    accessorKey: "status_to",
    header: "Status After",
    cell: (info) => <StatusBadge status={info.getValue() as StatusT} />,
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const itemId = row?.original?.item?.id;
      const productCode = row?.original?.item?.product_code;
      const station = row?.original?.item?.station;
      const number = row?.original?.item?.number;
      return (
        <div className="space-x-2">
          <ViewDetailButton itemId={String(itemId)} />
          <ReviewApproveButton
            itemId={String(itemId)}
            station={station}
            productCode={productCode}
            number={number}
          />
          <ReviewRejectButton
            itemId={String(itemId)}
            station={station}
            productCode={productCode}
            number={number}
          />
        </div>
      );
    },
  },
];
