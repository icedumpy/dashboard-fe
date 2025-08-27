import z from "zod";

import { STATION_STATUS } from "@/contants/station";

export const filtersSchema = z.object({
  product_code: z.string().min(2).max(100).optional(),
  roll_number: z.string().min(2).max(100).optional(),
  job_order_number: z.string().min(2).max(100).optional(),
  roll_width: z.string().min(2).max(100).optional(),
  status: z.array(z.enum(STATION_STATUS)).optional(),
  station: z.string().optional(),
  time_range: z.string().min(2).max(100).optional(),
  detected_to: z.string().min(2).max(100).optional(),
  detected_from: z.string().min(2).max(100).optional(),
  line_id: z.string().optional(),
});
