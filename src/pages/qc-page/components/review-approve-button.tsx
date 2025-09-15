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

export default function ReviewApproveButton({
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
  const handleApprove = () => {
    // TODO: integrate API
    toast.success("อนุมัติการเปลี่ยนสถานะเรียบร้อย");
    dismissDialog.dismiss();
  };

  return (
    <Dialog>
      <DialogTrigger>
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
            {productCode} - {station} {number}
          </p>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">ยกเลิก</Button>
          </DialogClose>
          <Button onClick={handleApprove}>ยืนยัน</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
