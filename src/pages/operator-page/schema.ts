import z from "zod";

import { STATUS } from "@/constants/status";
import { TH_NOT_ALLOWED } from "@/constants/validate";

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
  job_order_number: z
    .string()
    .regex(TH_NOT_ALLOWED, {
      message: "Job Order Number ไม่สามารถมีอักขระภาษาไทยได้",
    })
    .nonempty({ message: "กรุณากรอก Job Order Number" }),
  roll_number: z
    .string()
    .regex(TH_NOT_ALLOWED, {
      message: "Roll Number ไม่สามารถมีอักขระภาษาไทยได้",
    })
    .nonempty({ message: "กรุณากรอก Roll Number" }),
  roll_width: z
    .number({ error: "กรุณากรอก Roll Width เป็นตัวเลข" })
    .min(0, { message: "กรุณากรอก Roll Width ให้มากกว่าหรือเท่ากับ 0" })
    .max(9999, { message: "กรุณากรอก Roll Width ให้ไม่เกิน 4 หลัก" }),
  roll_id: z
    .string()
    .regex(TH_NOT_ALLOWED, {
      message: "Roll ID ไม่สามารถมีอักขระภาษาไทยได้",
    })
    .nonempty({ message: "กรุณากรอก Roll ID" }),
  product_code: z
    .string()
    .regex(TH_NOT_ALLOWED, {
      message: "Product Code ไม่สามารถมีอักขระภาษาไทยได้",
    })
    .nonempty({ message: "กรุณากรอก Product Code" }),
  bundle_number: z.string().regex(TH_NOT_ALLOWED, {
    message: "Bundle Number ไม่สามารถมีอักขระภาษาไทยได้",
  }),
});
