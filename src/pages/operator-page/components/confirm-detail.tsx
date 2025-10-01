import StatusBadge from "@/components/status-badge";
import { StationDetailResponse } from "@/types/item";

export default function ConfirmDetail({
  data,
}: {
  data?: StationDetailResponse["data"];
}) {
  return (
    <div className="p-4 space-y-2 border rounded-md">
      <p>ยืนยันการแก้ไขสำหรับ</p>
      <p>Product Code: {data?.product_code}</p>
      <p>Roll Number: {data?.roll_number}</p>
      <p>Job Order Number: {data?.job_order_number}</p>
      <p>Station: {data?.station}</p>
      <p>
        สถานะ: <StatusBadge status={String(data?.status_code)} />
      </p>
    </div>
  );
}
