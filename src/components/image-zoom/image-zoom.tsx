import Image from "rc-image";
import {
  FlipHorizontal2Icon,
  FlipVertical2Icon,
  RotateCcwIcon,
  RotateCwIcon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";
import "rc-image/assets/index.css";

import { cn } from "@/lib/utils";

export type ImageZoomProps = {
  src: string;
  alt?: string;
  className?: string;
  previewClassName?: string;
};

export const ImageZoom = ({
  src,
  alt,
  className,
  previewClassName,
}: ImageZoomProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      className={cn("cursor-zoom-in", className)}
      preview={{
        classNames: {
          body: "pointer-events-auto",
          wrapper: "pinter-events-auto",
        },
        getContainer: () => document.body,
        mask: <ZoomInIcon className="text-2xl text-white" />,
        icons: {
          zoomIn: <ZoomInIcon className="text-white size-4" />,
          zoomOut: (
            <ZoomOutIcon className="text-white size-4 [.rc-image-preview-operations-operation-disabled_&]:text-muted-foreground" />
          ),
          rotateLeft: <RotateCcwIcon className="text-white size-4" />,
          rotateRight: <RotateCwIcon className="text-white size-4" />,
          close: <XIcon className="text-white size-4" />,
          flipX: <FlipHorizontal2Icon className="text-white size-4" />,
          flipY: <FlipVertical2Icon className="text-white size-4" />,
        },
        className: previewClassName,
      }}
    />
  );
};
