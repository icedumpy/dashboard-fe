import z from "zod";

import { STATUS } from "@/contants/status";

export const filtersSchema = z.object({
  product_code: z.string().optional(),
  number: z.string().optional(),
  roll_id: z.string().optional(),
  job_order_number: z.string().optional(),
  roll_width_min: z.string().optional(),
  roll_width_max: z.string().optional(),
  status: z.array(z.enum(STATUS)).optional(),
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

export const updateItemDetailsSchema = z.object({
  roll_id: z.string({ error: "กรุณากรอก Roll ID" }).nonempty(),
  job_order_number: z
    .string({ error: "กรุณากรอก Job Order Number" })
    .nonempty(),
  roll_width: z.number({ error: "กรุณากรอก Roll Width" }).min(0).max(99999999),
  product_code: z.string({ error: "กรุณากรอก Product Code" }).nonempty(),
  roll_number: z.string({ error: "กรุณากรอก Roll Number" }).optional(),
  bundle_number: z.string().optional(),
});
