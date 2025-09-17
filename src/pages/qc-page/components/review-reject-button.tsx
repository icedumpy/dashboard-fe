import { useQueryClient } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
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
import { useDecideStatus } from "@/hooks/change-status/use-decide-status";
import { REVIEW_STATE } from "@/contants/review";
import { CHANGE_STATUS_ENDPOINT } from "@/contants/api";

export default function ReviewRejectButton({
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

  const handleReject = () => {
    decideStatus.mutate(
      {
        requestId: requestId,
        params: {
          decision: REVIEW_STATE.REJECTED,
          note: REVIEW_STATE.REJECTED,
        },
      },
      {
        onSuccess() {
          toast.success("ปฏิเสธการเปลี่ยนสถานะเรียบร้อย");
          queryClient.invalidateQueries({
            queryKey: [CHANGE_STATUS_ENDPOINT],
            exact: false,
          });
          dismissDialog.dismiss();
        },
        onError(error) {
          toast.error("ปฏิเสธการเปลี่ยนสถานะไม่สำเร็จ", {
            description: error.message,
          });
        },
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          className="text-destructive size-8"
        >
          <XIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ปฏิเสธการเปลี่ยนสถานะ</DialogTitle>
        </DialogHeader>
        <div className="p-2 bg-red-100 border rounded text-destructive border-destructive">
          <p className="flex items-center gap-2">
            <XIcon className="size-4" />{" "}
            <span>ปฏิเสธการเปลี่ยนสถานะ สำหรับ:</span>
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
          <Button onClick={handleReject} disabled={decideStatus.isPending}>
            ยืนยัน
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
