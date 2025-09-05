import { useQueryClient } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
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
import ImageDefect from "./image-defect";
import ImageRepair from "./image-repair";
import ProductDetail from "./production-details";

import { ITEM_ENDPOINT } from "@/contants/api";
import { STATION_STATUS } from "@/contants/station";
import { useAuth } from "@/hooks/auth/use-auth-v2";
import { useItemDetailAPI } from "@/hooks/item/use-item-detail";
import { useItemFixRequest } from "@/hooks/item/use-item-fix-request";
import { useImageUpload } from "@/hooks/upload/use-image-upload";

import type { ImageT } from "@/types/image";
import type { CheckButtonProps } from "../types";

export default function CheckButton({
  id,
  status,
  is_pending_review,
  item_data,
}: CheckButtonProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"VIEW" | "EDIT">("VIEW");
  const { user } = useAuth();
  const [line] = useQueryState("line", {
    defaultValue: String(user?.line?.id),
  });

  const queryClient = useQueryClient();

  const { data } = useItemDetailAPI(String(id), {
    enabled: open,
    staleTime: Infinity,
  });

  const imageUpload = useImageUpload();
  const itemFixRequest = useItemFixRequest();

  const isEditable = ![
    STATION_STATUS.NORMAL,
    STATION_STATUS.QC_PASSED,
  ].includes(status);
  const isCrossLine = Number(user?.line?.id) !== Number(line);
  const canEdit = isEditable && !isCrossLine && !is_pending_review;

  const toggleOpen = useCallback(() => {
    setOpen(!open);
    setMode("VIEW");
  }, [open]);

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
            description: error.message,
          });
        },
      }
    );
  }, [id, imageUpload, itemFixRequest, queryClient]);

  const hiddenRepairImages = ![
    STATION_STATUS.NORMAL,
    STATION_STATUS.SCRAP,
  ].includes(String(item_data?.status_code));

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
            <DialogTitle asChild>
              <div>
                <h3 className="text-xl font-bold">
                  ตรวจสอบ {item_data?.station.toUpperCase()}
                </h3>
                <p className="text-sm font-normal text-muted-foreground">
                  {data?.data?.product_code} - Role {data?.data.roll_number}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <blockquote className="font-bold">รูปปที่ระบบตรวจพบ</blockquote>
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
            {canEdit && <Button onClick={() => setMode("EDIT")}>แก้ไข</Button>}
            <DialogClose asChild>
              <Button variant="outline">ปิด</Button>
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
