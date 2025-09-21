import StatusBadge from "@/components/status-badge";
import ViewDetailButton from "../components/view-detail-button";
import ReviewApproveButton from "../components/review-approve-button";
import ReviewRejectButton from "../components/review-reject-button";

import { useItemDetailAPI } from "@/hooks/item/use-item-detail";
import { useProductionLineOptions } from "@/hooks/option/use-production-line-option";
import { STATION } from "@/contants/station";
import { STATUS_LIST } from "@/contants/status";
import { useDefectOptionAPI } from "@/hooks/option/use-defect-option";

import type { ColumnDef } from "@tanstack/react-table";
import type { StatusT } from "@/types/status";
import type { ChangeStatusT } from "@/types/change-status";

export const REVIEW_COLUMNS: ColumnDef<ChangeStatusT>[] = [
  {
    accessorKey: "line_id",
    header: "Production Line",
    cell: ({ row }) => {
      const itemId = row.original.item_id;
      return <LineId itemId={itemId} />;
    },
  },
  {
    accessorKey: "station",
    header: "Station",
    cell: ({ row }) => {
      const itemId = row.original.item_id;
      return <Station itemId={itemId} />;
    },
  },
  {
    accessorKey: "product_code",
    header: "Product Code",
    meta: { className: "text-center" },
    cell: ({ row }) => {
      const itemId = row.original.item_id;
      return <ItemProductCode itemId={itemId} />;
    },
  },
  {
    accessorKey: "roll_number",
    header: "Roll/Bundle Number",
    meta: { className: "text-center" },
    cell: ({ row }) => {
      const itemId = row.original.item_id;
      return <ItemNumber itemId={itemId} />;
    },
  },
  {
    accessorKey: "job_order_number",
    header: "Job Order Number",
    meta: { className: "text-center" },
    cell: ({ row }) => {
      const itemId = row.original.item_id;
      return <JobOrderNumber itemId={itemId} />;
    },
  },
  {
    accessorKey: "from_status_id",
    header: "Status Before",
    cell: (info) => {
      const id = info.getValue() as StatusT;
      const status = STATUS_LIST.find((s) => s.id === +id)?.code as StatusT;
      const defectTypes = info.row.original.defect_type_ids;
      return <ReviewStatus status={status} defectTypes={defectTypes} />;
    },
  },
  {
    accessorKey: "to_status_id",
    header: "Status After",
    cell: (info) => {
      const id = info.getValue() as StatusT;
      const status = STATUS_LIST.find((s) => s.id === +id)?.code as StatusT;
      const defectTypes = info.row.original.defect_type_ids;
      return <ReviewStatus status={status} defectTypes={defectTypes} />;
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const itemId = row?.original.item_id;
      const requestId = row?.original.id;

      return (
        <div className="space-x-2">
          <ViewDetailButton
            itemId={String(itemId)}
            reviewId={String(requestId)}
          />
          <ReviewApproveButton itemId={itemId} requestId={requestId} />
          <ReviewRejectButton itemId={itemId} requestId={requestId} />
        </div>
      );
    },
  },
];

// eslint-disable-next-line react-refresh/only-export-components
const LineId = ({ itemId }: { itemId: number }) => {
  const { data } = useItemDetailAPI(String(itemId));
  const { data: productionLineData } = useProductionLineOptions();
  const code = productionLineData?.find(
    (line) => line.value === String(data?.data?.line_id)
  )?.meta?.code;
  return <p>{code}</p>;
};

// eslint-disable-next-line react-refresh/only-export-components
const Station = ({ itemId }: { itemId: number }) => {
  const { data } = useItemDetailAPI(String(itemId));
  return <p>{data?.data?.station}</p>;
};

// eslint-disable-next-line react-refresh/only-export-components
const ItemProductCode = ({ itemId }: { itemId: number }) => {
  const { data } = useItemDetailAPI(String(itemId));
  return <p>{data?.data?.product_code}</p>;
};

// eslint-disable-next-line react-refresh/only-export-components
const ItemNumber = ({ itemId }: { itemId: number }) => {
  const { data } = useItemDetailAPI(String(itemId));
  const station = data?.data.station;
  return (
    <p>
      {station === STATION.ROLL
        ? data?.data?.roll_number
        : data?.data?.bundle_number}
    </p>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
const JobOrderNumber = ({ itemId }: { itemId: number }) => {
  const { data } = useItemDetailAPI(String(itemId));
  return <p>{data?.data?.job_order_number}</p>;
};

// eslint-disable-next-line react-refresh/only-export-components
const ReviewStatus = ({
  status,
  defectTypes,
}: {
  status: StatusT;
  defectTypes: number[];
}) => {
  const { data } = useDefectOptionAPI();
  const defectLabels = data
    ?.filter((defect) => defectTypes.includes(+defect.value))
    .map((defect) => defect.label);
  return <StatusBadge status={status} note={defectLabels?.join(", ")} />;
};
