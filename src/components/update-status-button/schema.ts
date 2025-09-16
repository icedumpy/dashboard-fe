import { z } from "zod";

export const updateStatusSchema = z
  .object({
    status: z.string(),
    defect_type_ids: z.array(z.number()).optional(),
  })
  .refine(
    (data) => {
      if (data.status === "1") {
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
