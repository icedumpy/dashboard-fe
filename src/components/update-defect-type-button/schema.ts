import z from "zod";

export const updateDefectTypeSchema = z.object({
  type: z.string().nonempty("กรุณาเลือกประเภท Defect"),
});
