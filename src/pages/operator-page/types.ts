import z from "zod";

import { StationItemType } from "@/types/station";
import { filtersSchema } from "./schema";

export interface CheckButtonProps {
  id: StationItemType["id"];
}

export type FilterType = z.infer<typeof filtersSchema>;
