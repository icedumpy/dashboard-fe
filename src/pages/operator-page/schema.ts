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
