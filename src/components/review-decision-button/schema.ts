import { REVIEW_STATE } from "@/contants/review";
import z from "zod";

export const reviewSchema = z
  .object({
    note: z.string().optional(),
    decision: z.enum([REVIEW_STATE.APPROVED, REVIEW_STATE.REJECTED]),
  })
  .refine(
    (data) => data.decision !== REVIEW_STATE.REJECTED || !!data.note?.trim(),
    {
      message: "Note is required when decision is REJECTED",
      path: ["note"],
    }
  );
