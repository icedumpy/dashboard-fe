import { toast } from "sonner";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/file-upload";
import ConfirmDetail from "./confirm-detail";
import ConfirmEditChecklist from "./confirm-edit-check-list";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { STATION_STATUS } from "@/contants/station";
import { useImageUpload } from "@/hooks/upload/use-image-upload";
import { useItemDetailAPI } from "@/hooks/item/use-item-detail";

import type { CheckButtonProps } from "../types";

export default function ConfirmButton({ id, status }: CheckButtonProps) {
  const [open, setOpen] = useState(false);
  const { data } = useItemDetailAPI(String(id), {
    enabled: open,
    staleTime: Infinity,
  });

  const imageUpload = useImageUpload();

  const onConfirmEdit = useCallback(() => {
    // TODO: Implement confirm edit logic
    console.log("Confirmed", { id, status });
  }, [id, status]);

  if (![STATION_STATUS.DEFECT, STATION_STATUS.SCRAP].includes(status))
    return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="text-xs rounded bg-amber-600 hover:bg-amber-600/90 h-fit py-0.5"
          onClick={() => console.log("Confirmed", { id, status })}
        >
          ยืนยันการแก้ไข
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>ยืนยันการแก้ไข</DialogTitle>
        <div className="space-y-4">
          <ConfirmDetail data={data?.data} />
          <ConfirmEditChecklist />
          <div className="p-4 space-y-2 border rounded-md">
            <p>อัปโหลดรูปหลังการแก้ไข (จำเป็น) *</p>
            <FileUpload
              value={imageUpload.data?.data[0]?.path}
              onChange={(e) => {
                const files = e.target.files;
                const payload = {
                  files: files as unknown as FileList,
                  item_id: String(id),
                };

                imageUpload.mutate(payload, {
                  onError(error) {
                    toast.error("อัพโหลดรูปภาพล้มเหลว", {
                      description: error.message,
                    });
                  },
                });
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">ยกเลิก</Button>
          </DialogClose>
          <Button
            className="bg-amber-600 hover:bg-amber-600/90"
            onClick={onConfirmEdit}
          >
            ยืนยันแก้ไข
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
