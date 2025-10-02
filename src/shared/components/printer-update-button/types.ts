import type { buttonVariants } from "@/shared/components/ui/button";
import type { VariantProps } from "class-variance-authority";

export type PrinterUpdateButtonProps = {
  buttonProps?: VariantProps<typeof buttonVariants>;
  itemId: number;
};
