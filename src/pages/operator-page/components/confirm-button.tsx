import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
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
import FileUpload from "@/components/ui/file-upload";
import ConfirmDetail from "./confirm-detail";
import ConfirmEditChecklist from "./confirm-edit-check-list";

import { ITEM_ENDPOINT } from "@/contants/api";
import { STATION_STATUS } from "@/contants/station";
import { useImageUpload } from "@/hooks/upload/use-image-upload";
import { useItemDetailAPI } from "@/hooks/item/use-item-detail";
import { useItemFixRequest } from "@/hooks/item/use-item-fix-request";
import { useAuth } from "@/hooks/auth/use-auth-v2";
import { ROLES } from "@/contants/auth";

import type { ImageT } from "@/types/image";
import type { CheckButtonProps } from "../types";

export default function ConfirmButton({
  id,
  status,
  is_pending_review,
}: CheckButtonProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { data } = useItemDetailAPI(String(id), {
    enabled: open,
    staleTime: Infinity,
  });

  const queryClient = useQueryClient();
  const imageUpload = useImageUpload();
  const itemFixRequest = useItemFixRequest();

  const onConfirmEdit = useCallback(() => {
    itemFixRequest.mutate(
      {
        item_data: String(id),
        image_ids:
          (imageUpload.data?.data as ImageT[]).map((img) => Number(img.id)) ||
          [],
        kinds: "Fixed defect using patching method",
      },
      {
        onSuccess() {
          toast.success("แก้ไขสำเร็จ");
          queryClient.invalidateQueries({
            queryKey: [ITEM_ENDPOINT],
            exact: false,
          });
          imageUpload.reset();

          setOpen(false);
        },
        onError(error) {
          toast.error("แก้ไขไม่สำเร็จ", {
            description: JSON.stringify(error),
          });
        },
      }
    );
  }, [id, imageUpload, itemFixRequest, queryClient]);

  const ALLOWED_STATUSES = [STATION_STATUS.DEFECT, STATION_STATUS.REJECTED];

  if (!ALLOWED_STATUSES.includes(status) || user?.role === ROLES.VIEWER)
    return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="text-xs rounded bg-amber-600 hover:bg-amber-600/90 h-fit py-0.5"
          disabled={is_pending_review}
        >
          {is_pending_review ? "รอการตรวจสอบ" : "ส่งเรื่องแก้ไข"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ยืนยันการแก้ไข</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <ConfirmDetail data={data?.data} />
          <ConfirmEditChecklist />
          {data?.data.status_code != STATION_STATUS.SCRAP && (
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
          )}
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
