import { VariantProps } from "class-variance-authority";

import { REVIEW_STATE } from "@/constants/review";
import { buttonVariants } from "@/components/ui/button";

export interface ReviewDecisionButtonProps {
  itemId: string;
  reviewId: string;
  decision: typeof REVIEW_STATE.APPROVED | typeof REVIEW_STATE.REJECTED;
  buttonProps?: VariantProps<typeof buttonVariants> & { className?: string };
}
