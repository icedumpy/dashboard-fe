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

export default function ReviewRejectButton({
  itemId,
  productCode,
  number,
  station,
}: {
  itemId: string;
  productCode: string;
  number: string;
  station: string;
}) {
  const dismissDialog = useDismissDialog();

  const handleReject = () => {
    // TODO: integrate API
    toast.success("ปฏิเสธการเปลี่ยนสถานะเรียบร้อย");
    dismissDialog.dismiss();
  };
  return (
    <Dialog>
      <DialogTrigger>
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
          <DialogTitle>ปฏิเสธการเปลี่ยนสถานะ #{itemId}</DialogTitle>
        </DialogHeader>
        <div className="p-2 bg-red-100 border rounded text-destructive border-destructive">
          <p className="flex items-center gap-2">
            <XIcon className="size-4" />{" "}
            <span>ปฏิเสธการเปลี่ยนสถานะ สำหรับ:</span>
          </p>
          <p>
            {productCode} - {station} {number}
          </p>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">ยกเลิก</Button>
          </DialogClose>
          <Button onClick={handleReject}>ยืนยัน</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
