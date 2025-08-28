import { isEmpty } from "radash";
import { useEffect, useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { IMAGE_PATH_ENDPOINT } from "@/contants/api";
import { UploadService } from "@/services/upload-service";

import type { ImageType } from "@/types/station";
import type { CarouselApi } from "@/components/ui/carousel";

export default function ImageRepair({ images }: { images?: ImageType[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const imageQueries = useQueries({
    queries:
      images?.map((img) => ({
        queryKey: [IMAGE_PATH_ENDPOINT, img.path],
        queryFn: () => UploadService.getImageBold(img.path),
      })) ?? [],
  });

  // Extract blobs from queries
  const imageBlobs = imageQueries.map((q) => q.data);

  // สร้าง URL ชั่วคราวจาก blob
  const imageUrls = useMemo(() => {
    if (!images || images.length === 0) return [];
    return images.map((img, idx) => {
      const blob = imageBlobs[idx];
      return img.path && blob instanceof Blob
        ? URL.createObjectURL(blob)
        : null;
    });
  }, [imageBlobs, images]);

  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [imageUrls]);

  useEffect(() => {
    if (!api) return;

    const update = () => {
      setCurrent((api?.selectedScrollSnap() ?? 0) + 1);
    };

    update();

    api.on("select", update);

    return () => {
      api.off("select", update);
    };
  }, [api]);

  return (
    <div className="space-y-2">
      <h3 className="font-bold text-green-600">รูปหลังการแก้ไข (Repair)</h3>
      {isEmpty(images) ? (
        <div className="grid text-sm border place-content-center aspect-video bg-accent text-muted-foreground">
          ไม่มีรูปภาพ
        </div>
      ) : (
        <div>
          <Carousel className="border rounded" setApi={setApi}>
            <CarouselContent>
              {images?.map((image, idx) => (
                <CarouselItem key={image.id} className="aspect-video">
                  {imageUrls[idx] ? (
                    <img
                      src={imageUrls[idx]}
                      className="object-contain w-auto h-full mx-auto"
                      id={encodeURIComponent(image.path)}
                      alt={`Defect image ${image.id}`}
                    />
                  ) : (
                    <div className="grid w-full h-full text-sm place-content-center bg-accent text-muted-foreground">
                      Image Not Found
                    </div>
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext className="right-2" />
            <CarouselPrevious className="left-2" />
          </Carousel>
          <div className="py-2 text-sm text-center text-muted-foreground">
            {current} of {images?.length}
          </div>
        </div>
      )}
    </div>
  );
}
