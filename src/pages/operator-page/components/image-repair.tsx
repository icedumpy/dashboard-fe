import { isEmpty } from "radash";

import type { ImageType } from "@/types/station";

export default function ImageRepair({ images }: { images?: ImageType[] }) {
  return (
    <div className="space-y-2">
      <h3>รูปหลังการแก้ไข (Repair)</h3>
      <div className="border rounded bg-accent">
        {isEmpty(images) && (
          <div className="grid text-sm place-content-center bg-accent text-muted-foreground aspect-video">
            ไม่มีรูปหลังการแก้ไข
          </div>
        )}
      </div>
    </div>
  );
}
