import z from "zod";

export const updateDefectTypeSchema = z.object({
  type: z.string({ message: "กรุณาเลือกประเภท Defect" }).nonempty(),
});
