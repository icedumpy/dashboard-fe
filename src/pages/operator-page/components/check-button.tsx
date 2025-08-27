import { useState } from "react";

import { Button } from "@/components/ui/button";
import ProductDetail from "./production-details";
import ImageCarousel from "./image-carousel";
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

import { useItemDetailAPI } from "@/hooks/item/use-item-detail";

import type { CheckButtonProps } from "../types";

export default function CheckButton({ id }: CheckButtonProps) {
  const [open, setOpen] = useState(false);

  const { data } = useItemDetailAPI(String(id), {
    enabled: open,
    staleTime: Infinity,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="text-xs rounded h-fit py-0.5"
          onClick={() => setOpen(true)}
        >
          ตรวจสอบ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl ">
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
            <div className="flex gap-2">
              <div className="w-1/2">
                <ImageCarousel images={data?.images?.DETECTED} />
              </div>
              <div className="w-1/2">
                <ImageRepair images={data?.images?.FIX} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <ProductDetail data={data?.data} />
          </div>
        </div>
        <DialogFooter>
          <Button>ยืนยันการแก้ใข</Button>
          <DialogClose>
            <Button variant="outline">ปิด</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
