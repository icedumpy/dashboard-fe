import z from "zod";

import { updateStatusSchema } from "./schema";
import { STATION } from "@/constants/station";

export type UpdateStatusT = z.infer<typeof updateStatusSchema>;

export interface UpdateStatusButtonProps {
  itemId: string;
  stationType?: (typeof STATION)[keyof typeof STATION];
}
