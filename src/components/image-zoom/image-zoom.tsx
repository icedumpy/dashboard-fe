import * as React from "react";
import { twMerge } from "tailwind-merge";
import RcImage from "rc-image";
import { EyeIcon } from "lucide-react";
import "rc-image/assets/index.css";
import "@/styles/image-zoom.css";

import PreviewGroup from "./preview-group";
import { icons } from "./icons";

import type { ImagePreviewType, ImageProps as RcImageProps } from "rc-image";
export interface CompositionImage<P> extends React.FC<P> {
  PreviewGroup: typeof PreviewGroup;
}

type Replace<T, K extends keyof T, V> = Partial<Omit<T, K> & { [P in K]: V }>;

interface PreviewType extends Omit<ImagePreviewType, "destroyOnClose"> {
  /** @deprecated Please use destroyOnHidden instead */
  destroyOnClose?: boolean;
  destroyOnHidden?: boolean;
}

type ImageProps = Replace<RcImageProps, "preview", boolean | PreviewType>;

const ImageZoom: CompositionImage<ImageProps> = (props) => {
  const { preview, className, style, ...otherProps } = props;

  const mergedPreview = React.useMemo<RcImageProps["preview"]>(() => {
    if (preview === false) return false;
    const _preview = typeof preview === "object" ? preview : {};
    const { destroyOnHidden, destroyOnClose, ...restPreviewProps } = _preview;

    return {
      mask: (
        <div className="flex items-center gap-2 px-3 py-1 text-sm text-white rounded-md">
          <EyeIcon className="w-4 h-4" /> Preview
        </div>
      ),
      icons,
      ...restPreviewProps,
      destroyOnClose: destroyOnHidden ?? destroyOnClose,
    };
  }, [preview]);

  return (
    <RcImage
      preview={mergedPreview}
      className={twMerge("rounded-lg shadow-md", className)}
      style={style}
      {...otherProps}
    />
  );
};

export type { ImageProps };

ImageZoom.PreviewGroup = PreviewGroup;

export default ImageZoom;
