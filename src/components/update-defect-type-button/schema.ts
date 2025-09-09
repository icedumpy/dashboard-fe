import z from "zod";

export const updateDefectTypeSchema = z.object({
  type: z.array(z.number()).nonempty({ message: "กรุณาเลือกประเภท Defect" }),
});
