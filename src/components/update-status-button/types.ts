import z from "zod";

import { updateStatusSchema } from "./schema";

export type UpdateStatusT = z.infer<typeof updateStatusSchema>;

export interface UpdateStatusButtonProps {
  itemId: string;
}
