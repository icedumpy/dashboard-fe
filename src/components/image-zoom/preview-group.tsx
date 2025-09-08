import * as React from "react";
import RcImage from "rc-image";

import { icons } from "./icons";

import type { GroupConsumerProps } from "rc-image/lib/PreviewGroup";

const InternalPreviewGroup: React.FC<GroupConsumerProps> = ({
  preview,
  ...otherProps
}) => {
  const memoizedIcons = React.useMemo(() => icons, []);

  const mergedPreview = React.useMemo<GroupConsumerProps["preview"]>(() => {
    if (preview === false) return false;
    const _preview = typeof preview === "object" ? preview : {};
    return {
      ..._preview,
      rootClassName: "relative z-[2000]", // tailwind
      zIndex: 2000,
    };
  }, [preview]);

  return (
    <RcImage.PreviewGroup
      preview={mergedPreview}
      icons={memoizedIcons}
      {...otherProps}
    />
  );
};

export default InternalPreviewGroup;
