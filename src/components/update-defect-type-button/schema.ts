import z from "zod";

export const updateDefectTypeSchema = z.object({
  type: z.array(z.string()).nonempty({ message: "กรุณาเลือกประเภท Defect" }),
});
