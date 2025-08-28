import { useCallback, useState } from "react";
import { useQueryState } from "nuqs";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import ProductDetail from "./production-details";
import ImageDefect from "./image-defect";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImageRepair from "./image-repair";
import FileUpload from "@/components/ui/file-upload";

import { useItemDetailAPI } from "@/hooks/item/use-item-detail";
import { STATION_STATUS } from "@/contants/station";
import { useImageUpload } from "@/hooks/upload/use-image-upload";
import { useAuth } from "@/hooks/auth/use-auth-v2";
import { useItemFixRequest } from "@/hooks/item/use-item-fix-request";
import { ITEM_ENDPOINT } from "@/contants/api";

import type { CheckButtonProps } from "../types";
import type { ImageT } from "@/types/image";

export default function CheckButton({ id, status }: CheckButtonProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"VIEW" | "EDIT">("VIEW");
  const { user } = useAuth();
  const [line] = useQueryState("line", {
    defaultValue: String(user?.line.id),
  });

  const queryClient = useQueryClient();

  const { data } = useItemDetailAPI(String(id), {
    enabled: open,
    staleTime: Infinity,
  });

  const imageUpload = useImageUpload();
  const itemFixRequest = useItemFixRequest();

  const isEditable =
    status === STATION_STATUS.NORMAL || status === STATION_STATUS.QC_PASSED;
  const isCrossLine = Number(user?.line.id) !== Number(line);

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
          toast("แก้ไขสำเร็จ");
          queryClient.invalidateQueries({
            queryKey: [ITEM_ENDPOINT],
            exact: false,
          });

          setOpen(false);
        },
        onError(error) {
          toast("แก้ไขไม่สำเร็จ", {
            description: error.message,
          });
        },
      }
    );
  }, [id, imageUpload.data?.data, itemFixRequest, queryClient]);

  return (
    <>
      {/* Edit */}
      <Dialog open={mode === "VIEW" && open} onOpenChange={toggleOpen}>
        <DialogTrigger>
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
                <h3 className="text-xl font-bold">ตรวจสอบ Defect</h3>
                <p className="text-sm font-normal text-muted-foreground">
                  {data?.data?.product_code} - Role {data?.data.roll_number}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <blockquote className="font-bold">
                การเปรียบเทียบรูป Defect และรูปหลังการแก้ไข
              </blockquote>
              <div className="flex flex-col gap-2 md:flex-row">
                <div className="w-full md:w-1/2">
                  <ImageDefect images={data?.images?.DETECTED} />
                </div>
                <div className="w-full md:w-1/2">
                  <ImageRepair images={data?.images?.FIX} />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <ProductDetail data={data?.data} />
            </div>
          </div>
          <DialogFooter>
            {(isEditable || !isCrossLine) && (
              <Button onClick={() => setMode("EDIT")}>แก้ไข</Button>
            )}
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
            <div className="p-3 space-y-2 border rounded">
              <p>ยืนยันการแก้ไขสำหรับ</p>
              <p className="text-sm">
                Product Code: {data?.data?.product_code}
              </p>
              <p>Roll Number: {data?.data?.roll_number}</p>
              <p>Job Order Number: {data?.data?.job_order_number}</p>
              <p>Station: {data?.data?.station}</p>
              <p>
                สถานะ: {data?.data?.status_code} ({data?.data?.ai_note})
              </p>
            </div>
            <div className="p-3 space-y-2 border rounded">
              <p>การยืนยันการแก้ไขข้อบกพร่องนี้ คุณยืนยันว่าได้:</p>
              <ul className="list-disc list-inside">
                <li>ตรวจสอบรายละเอียด Defect แล้ว</li>
                <li>ดำเนินการแก้ไขแล้ว</li>
              </ul>
            </div>
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
                      toast("อัพโหลดรูปภาพล้มเหลว", {
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
            <Button onClick={onConfirmEdit} disabled={itemFixRequest.isPending}>
              ยืนยันการแก้ไข
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
