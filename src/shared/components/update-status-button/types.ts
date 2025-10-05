import z from "zod";

import { updateStatusSchema } from "./schema";
import { Station } from "@/shared/types/station";

export type UpdateStatusT = z.infer<typeof updateStatusSchema>;

export interface UpdateStatusButtonProps {
  itemId: string;
  station: Station;
}
