import { useQueryClient } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FileUpload from "@/components/ui/file-upload";
import ConfirmDetail from "./confirm-detail";
import ConfirmEditChecklist from "./confirm-edit-check-list";
import ImageDefect from "./image-defect";
import ImageRepair from "./image-repair";
import ProductDetail from "./production-details";
import UpdateStatusButton from "@/components/update-status-button";

import { ITEM_ENDPOINT } from "@/contants/api";
import {
  shouldShowUpdateStatusButton,
  isHiddenRepairImages,
  canRequestChanges,
} from "@/utils/item-status";
import { useAuth } from "@/hooks/auth/use-auth";
import { useItemDetailAPI } from "@/hooks/item/use-item-detail";
import { useItemFixRequest } from "@/hooks/item/use-item-fix-request";
import { useImageUpload } from "@/hooks/upload/use-image-upload";

import type { ImageT } from "@/types/image";
import type { CheckButtonProps } from "../types";

export default function CheckButton({
  itemId,
  status,
  isPendingReview = false,
  itemData,
  stationType,
  isChangingStatusPending,
}: CheckButtonProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"VIEW" | "EDIT">("VIEW");
  const { user } = useAuth();
  const [line] = useQueryState("line_id", {
    defaultValue: String(user?.line?.id),
  });

  const queryClient = useQueryClient();
  const { data } = useItemDetailAPI(String(itemId), {
    enabled: open,
  });
  const imageUpload = useImageUpload();
  const itemFixRequest = useItemFixRequest();

  const canUpdateStatus = shouldShowUpdateStatusButton(
    data?.data?.status_code,
    user
  );
  const hiddenRepairImages = isHiddenRepairImages(itemData?.status_code);
  const canRequestChangesValue = canRequestChanges(
    status,
    Number(user?.line?.id),
    line,
    isPendingReview
  );

  const toggleOpen = useCallback(() => {
    setOpen(!open);
    setMode("VIEW");
  }, [open]);

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
            description: error.message,
          });
        },
      }
    );
  }, [itemId, imageUpload, itemFixRequest, queryClient]);

  return (
    <>
      {/* Edit */}
      <Dialog open={mode === "VIEW" && open} onOpenChange={toggleOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="text-xs rounded h-fit py-0.5"
            onClick={() => setOpen(true)}
          >
            ตรวจสอบ
          </Button>
        </DialogTrigger>
        <DialogContent
          aria-describedby={undefined}
          className="overflow-auto sm:max-w-4xl"
        >
          <DialogHeader>
            <DialogTitle>ตรวจสอบ {itemData?.station.toUpperCase()}</DialogTitle>
            <DialogDescription>
              {data?.data?.product_code} - Role {data?.data.roll_number}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <blockquote className="font-bold">รูปที่ระบบตรวจพบ</blockquote>
              <div className="flex flex-col gap-2 md:flex-row">
                <div
                  className={
                    hiddenRepairImages ? "w-full md:w-1/2" : "w-full md"
                  }
                >
                  <ImageDefect images={data?.images?.DETECTED} />
                </div>
                {hiddenRepairImages && (
                  <div className="w-full md:w-1/2">
                    <ImageRepair images={data?.images?.FIX} />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <ProductDetail
                data={data?.data}
                defects={data?.defects}
                reviews={data?.reviews}
              />
            </div>
          </div>
          <DialogFooter>
            {canRequestChangesValue && (
              <Button
                onClick={() => setMode("EDIT")}
                variant="update"
                disabled={isPendingReview || isChangingStatusPending}
              >
                ส่งเรื่องแก้ไข
              </Button>
            )}
            {canUpdateStatus && (
              <UpdateStatusButton
                itemId={String(itemId)}
                stationType={stationType}
                disabled={isChangingStatusPending}
              />
            )}
            <DialogClose asChild>
              <Button variant="outline" type="button">
                ปิด
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={mode === "EDIT" && open} onOpenChange={toggleOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>ยืนยันการแก้ใข</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-base">
            <ConfirmDetail data={data?.data} />
            <ConfirmEditChecklist />
            <div className="p-3 space-y-2 border rounded">
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
              disabled={itemFixRequest.isPending || imageUpload.isPending}
            >
              ยืนยันการแก้ไข
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
