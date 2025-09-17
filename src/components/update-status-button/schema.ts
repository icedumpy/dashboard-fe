import { z } from "zod";

import { STATUS_OPTIONS } from "./constants";

export const updateStatusSchema = z
  .object({
    statusId: z.string(),
    defect_type_ids: z.array(z.number()).optional(),
  })
  .refine(
    (data) => {
      if (data.statusId === STATUS_OPTIONS[2].value) {
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
