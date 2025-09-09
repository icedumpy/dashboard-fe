import { z } from "zod";

import { STATION_STATUS } from "@/contants/station";

export const updateStatusSchema = z
  .object({
    status: z.enum(STATION_STATUS, { error: "กรุณาเลือกสถานะ" }),
    defect_type_ids: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.status === STATION_STATUS.DEFECT) {
        return (
          Array.isArray(data.defect_type_ids) && data.defect_type_ids.length > 0
        );
      }
      return true;
    },
    {
      message: "กรุณาเลือกประเภทความเสียหาย",
      path: ["defect_type_ids"],
    }
  );
