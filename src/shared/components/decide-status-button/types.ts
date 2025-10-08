import { VariantProps } from "class-variance-authority";

import { buttonVariants } from "@/shared/components/ui/button";
import { REVIEW_STATE } from "@/shared/constants/review";

export interface DecideStatusButtonProps {
  itemId: number;
  decision: typeof REVIEW_STATE.APPROVED | typeof REVIEW_STATE.REJECTED;
  request_id: number;
  buttonProps?: VariantProps<typeof buttonVariants> & { className?: string };
}
