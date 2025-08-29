import z from "zod";

import { STATION_STATUS } from "@/contants/station";

export const filtersSchema = z.object({
  product_code: z.string().optional(),
  number: z.string().optional(),
  job_order_number: z.string().optional(),
  roll_width_min: z.number().optional(),
  roll_width_max: z.number().optional(),
  status: z.array(z.enum(STATION_STATUS)).optional(),
  station: z.string().optional(),
  time_range: z.string().optional(),
  detected_to: z.string().optional(),
  detected_from: z.string().optional(),
  line_id: z.string().optional(),
  page: z.number().optional(),
});

export const classifyScrapSchema = z
  .object({
    type: z.enum(["defect", "scrap"]),
    images: z
      .array(
        z.object({
          id: z.number(),
          kind: z.string(),
          path: z.string(),
        })
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "defect" && (!data.images || data.images.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["images"],
        message: "images is required when type is defect",
      });
    }
  });
