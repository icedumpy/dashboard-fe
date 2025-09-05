import z from "zod";

export const updateStatusSchema = z.object({
  status: z.string({ message: "กรุณาเลือกสถานะ" }).nonempty(),
});
