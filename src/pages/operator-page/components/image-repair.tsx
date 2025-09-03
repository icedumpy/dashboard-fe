import { isEmpty } from "radash";

import ImageCarousel from "@/components/image-carousel";

import type { ImageT } from "@/types/image";

export default function ImageRepair({ images }: { images?: ImageT[] }) {
  return (
    <div className="space-y-2">
      <h3 className="font-bold text-green-600">รูปหลังการแก้ไข (Repair)</h3>
      {isEmpty(images) ? (
        <div className="grid h-full text-sm border rounded place-content-center aspect-[16/9.4] bg-accent text-muted-foreground">
          ไม่มีรูปภาพ
        </div>
      ) : (
        <ImageCarousel images={images} />
      )}
    </div>
  );
}
