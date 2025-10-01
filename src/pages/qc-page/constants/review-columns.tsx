import StatusBadge from "@/components/status-badge";
import ViewDetailButton from "../components/view-detail-button";
import ReviewDecisionButton from "@/components/review-decision-button";
import DefectAlertIcon from "@/components/defect-alert-icon";

import { useItemDetailAPI } from "@/hooks/item/use-item-detail";
import { useProductionLineOptions } from "@/hooks/option/use-production-line-option";
import { STATION, STATION_STATUS } from "@/constants/station";
import { STATUS_LIST } from "@/constants/status";
import { useDefectOptionAPI } from "@/hooks/option/use-defect-option";
import { REVIEW_STATE } from "@/constants/review";

import type { ColumnDef } from "@tanstack/react-table";
import type { StatusT } from "@/types/status";
import type { ChangeStatusT } from "@/types/change-status";

export const REVIEW_COLUMNS: ColumnDef<ChangeStatusT>[] = [
  {
    accessorKey: "production_line",
    header: "Production Line",
    enableSorting: true,
    cell: ({ row }) => {
      const itemId = row.original.item_id;
      const currentStatusId = row.original.to_status_id;
      const isDefect =
        (STATUS_LIST.find((s) => s.id === +currentStatusId)
          ?.code as StatusT) === STATION_STATUS.DEFECT;

      return (
        <div className="flex items-center justify-start gap-1">
          <DefectAlertIcon isDefect={isDefect} />
          <LineId itemId={itemId} />
        </div>
      );
    },
  },
  {
    accessorKey: "station",
    header: "Station",
    enableSorting: true,
    cell: ({ row }) => {
      const itemId = row.original.item_id;
      return <Station itemId={itemId} />;
    },
  },
  {
    accessorKey: "product_code",
    header: "Product Code",
    enableSorting: true,
    meta: { className: "text-center" },
    cell: ({ row }) => {
      const itemId = row.original.item_id;
      return <ItemProductCode itemId={itemId} />;
    },
  },
  {
    accessorKey: "number",
    header: "Roll/Bundle Number",
    enableSorting: true,
    meta: { className: "text-center" },
    cell: ({ row }) => {
      const itemId = row.original.item_id;
      return <ItemNumber itemId={itemId} />;
    },
  },
  {
    accessorKey: "job_order_number",
    header: "Job Order Number",
    enableSorting: true,
    meta: { className: "text-center" },
    cell: ({ row }) => {
      const itemId = row.original.item_id;
      return <JobOrderNumber itemId={itemId} />;
    },
  },
  {
    accessorKey: "status_before",
    header: "Status Before",
    enableSorting: true,
    cell: ({ row }) => {
      const id = row.original.from_status_id;
      const status = STATUS_LIST.find((s) => s.id === +id)?.code as StatusT;
      const defectTypes = row.original.defect_type_ids;
      return <ReviewStatus status={status} defectTypes={defectTypes} />;
    },
  },
  {
    accessorKey: "status_after",
    header: "Status After",
    enableSorting: true,
    cell: ({ row }) => {
      const id = row.original.to_status_id;
      const status = STATUS_LIST.find((s) => s.id === +id)?.code as StatusT;
      const defectTypes = row.original.defect_type_ids;
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
          <ReviewDecisionButton
            itemId={String(itemId)}
            reviewId={String(requestId)}
            decision={REVIEW_STATE.APPROVED}
            buttonProps={{ className: "size-8" }}
          />
          <ReviewDecisionButton
            itemId={String(itemId)}
            reviewId={String(requestId)}
            decision={REVIEW_STATE.REJECTED}
            buttonProps={{ className: "size-8" }}
          />
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
