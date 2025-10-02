import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import FileUpload from "@/shared/components/ui/file-upload";
import ConfirmDetail from "./confirm-detail";
import ConfirmEditChecklist from "./confirm-edit-check-list";

import { ITEM_ENDPOINT } from "@/shared/constants/api";
import { useImageUpload } from "@/shared/hooks/upload/use-image-upload";
import { useItemDetailAPI } from "@/shared/hooks/item/use-item-detail";
import { useItemFixRequest } from "@/shared/hooks/item/use-item-fix-request";
import { useAuth } from "@/shared/hooks/auth/use-auth";
import { ROLES } from "@/shared/constants/auth";
import { STATUS } from "@/shared/constants/status";

import type { ImageT } from "@/shared/types/image";
import type { CheckButtonProps } from "../types";

export default function ConfirmButton({ itemId }: CheckButtonProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { data } = useItemDetailAPI(String(itemId), {
    enabled: open,
    staleTime: Infinity,
  });

  const queryClient = useQueryClient();
  const imageUpload = useImageUpload();
  const itemFixRequest = useItemFixRequest();
  const isPendingReview = Boolean(data?.data?.is_pending_review);
  const isChangingStatusPending = Boolean(
    data?.data?.is_changing_status_pending
  );

  const onConfirmEdit = useCallback(() => {
    itemFixRequest.mutate(
      {
        itemId: String(itemId),
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
  }, [itemId, imageUpload, itemFixRequest, queryClient]);

  const ALLOWED_STATUSES = [STATUS.DEFECT, STATUS.REJECTED];

  if (!ALLOWED_STATUSES.includes(status) || user?.role === ROLES.VIEWER)
    return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="text-xs rounded bg-amber-600 hover:bg-amber-600/90 h-fit py-0.5"
          disabled={isPendingReview || isChangingStatusPending}
        >
          {isPendingReview ? "รอการตรวจสอบ" : "ส่งเรื่องแก้ไข"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ยืนยันการแก้ไข</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <ConfirmDetail data={data?.data} />
          <ConfirmEditChecklist />
          {data?.data.status_code != STATUS.SCRAP && (
            <div className="p-4 space-y-2 border rounded-md">
              <p>อัปโหลดรูปหลังการแก้ไข (จำเป็น) *</p>
              <FileUpload
                value={imageUpload.data?.data[0]?.path}
                onChange={(e) => {
                  const files = e.target.files;
                  const payload = {
                    files: files as unknown as FileList,
                    item_id: String(itemId),
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
          <DialogClose asChild>
            <Button variant="outline" type="button">
              ยกเลิก
            </Button>
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
