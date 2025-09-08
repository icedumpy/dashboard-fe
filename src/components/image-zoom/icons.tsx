import {
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  RotateCw,
  Repeat,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

export const icons = {
  rotateLeft: <RotateCcw className="w-5 h-5" />,
  rotateRight: <RotateCw className="w-5 h-5" />,
  zoomIn: <ZoomIn className="w-5 h-5" />,
  zoomOut: <ZoomOut className="w-5 h-5" />,
  close: <X className="w-5 h-5" />,
  left: <ChevronLeft className="w-5 h-5" />,
  right: <ChevronRight className="w-5 h-5" />,
  flipX: <Repeat className="w-5 h-5" />,
  flipY: <Repeat className="w-5 h-5 rotate-90" />,
};
