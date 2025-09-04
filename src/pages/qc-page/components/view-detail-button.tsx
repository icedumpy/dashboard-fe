import { useState } from "react";
import { EyeIcon } from "lucide-react";

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
import ImageDefect from "@/pages/operator-page/components/image-defect";
import ImageRepair from "@/pages/operator-page/components/image-repair";
import ProductDetail from "@/pages/operator-page/components/production-details";

import { useItemDetailAPI } from "@/hooks/item/use-item-detail";

export default function ViewDetailButton({ itemId }: { itemId: string }) {
  const [open, setOpen] = useState(false);
  const { data } = useItemDetailAPI(itemId, {
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="size-8 text-primary" variant="secondary">
          <EyeIcon />
          {itemId}
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
        <div>
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
              <ProductDetail
                data={data?.data}
                defects={data?.defects}
                reviews={data?.reviews}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">ปิด</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
