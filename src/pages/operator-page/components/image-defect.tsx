import { isEmpty } from "radash";

import ImageCarousel from "@/components/image-carousel";

import type { ImageT } from "@/types/image";

export default function ImageDefect({ images }: { images?: ImageT[] }) {
  return (
    <div className="space-y-2">
      <h3 className="font-bold text-orange-600">รูปที่ระบบตรวจพบ</h3>
      {isEmpty(images) ? (
        <div className="grid pb-2 text-sm border rounded place-content-center aspect-[16/9.4] bg-accent text-muted-foreground">
          ไม่มีรูปภาพ
        </div>
      ) : (
        <ImageCarousel images={images} />
      )}
    </div>
  );
}
