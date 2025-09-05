import { useEffect, useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ImageZoom from "../image-zoom";

import { UploadService } from "@/services/upload-service";
import { IMAGE_PATH_ENDPOINT } from "@/contants/api";

import type { ImageCarouselProps } from "./types";

export default function ImageCarousel({ images }: ImageCarouselProps) {
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
  const imageBlobs = imageQueries.map((q) => q.data ?? q.error);

  // Generate object URLs for images
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
    <div className="relative overflow-hidden">
      <Carousel className="border rounded" setApi={setApi}>
        <CarouselContent>
          {images?.map((image, idx) => (
            <CarouselItem key={image.id}>
              <div className="grid place-content-center">
                {imageUrls[idx] ? (
                  <ImageZoom
                    className="m-auto aspect-video"
                    src={imageUrls[idx]}
                    alt={imageUrls[idx]}
                  />
                ) : (
                  <div className="grid w-full h-full text-sm place-content-center bg-accent text-muted-foreground">
                    {imageBlobs[idx] instanceof Error
                      ? imageBlobs[idx].message
                      : "Loading..."}
                  </div>
                )}
              </div>
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
  );
}
