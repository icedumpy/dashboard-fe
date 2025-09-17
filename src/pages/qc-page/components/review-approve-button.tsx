import { useQueryClient } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import useDismissDialog from "@/hooks/use-dismiss-dialog";
import { useItemDetailAPI } from "@/hooks/item/use-item-detail";
import { CHANGE_STATUS_ENDPOINT } from "@/contants/api";
import { useDecideStatus } from "@/hooks/change-status/use-decide-status";
import { REVIEW_STATE } from "@/contants/review";

export default function ReviewApproveButton({
  itemId,
  requestId,
}: {
  itemId: number;
  requestId: number;
}) {
  const queryClient = useQueryClient();
  const dismissDialog = useDismissDialog();
  const { data: item } = useItemDetailAPI(String(itemId));
  const decideStatus = useDecideStatus();

  const handleApprove = () => {
    decideStatus.mutate(
      {
        requestId: requestId,
        params: {
          decision: REVIEW_STATE.APPROVED,
          note: REVIEW_STATE.APPROVED,
        },
      },
      {
        onSuccess() {
          toast.success("อนุมัติการเปลี่ยนสถานะเรียบร้อย");
          queryClient.invalidateQueries({
            queryKey: [CHANGE_STATUS_ENDPOINT],
            exact: false,
          });
          dismissDialog.dismiss();
        },
        onError(error) {
          toast.error("อนุมัติการเปลี่ยนสถานะไม่สำเร็จ", {
            description: error.message,
          });
        },
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" className="text-green-600 size-8">
          <CheckIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>อนุมัติการเปลี่ยนสถานะ #{itemId}</DialogTitle>
        </DialogHeader>
        <div className="p-2 text-green-600 bg-green-100 border border-green-600 rounded">
          <p className="flex items-center gap-2">
            <CheckIcon className="size-4" />{" "}
            <span>ยืนยันการเปลี่ยนสถานะ สำหรับ:</span>
          </p>
          <p>
            {item?.data.product_code} - {item?.data.station}{" "}
            {item?.data.roll_number}
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              ยกเลิก
            </Button>
          </DialogClose>
          <Button onClick={handleApprove} disabled={decideStatus.isPending}>
            ยืนยัน
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
