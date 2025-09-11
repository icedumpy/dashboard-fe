import z from "zod";

import { StationItemType } from "@/types/station";
import { filtersSchema } from "./schema";
import { STATION } from "@/contants/station";

export interface CheckButtonProps {
  isPendingReview: boolean;
  id: StationItemType["id"];
  status: StationItemType["status_code"];
  itemData?: StationItemType;
  stationType: (typeof STATION)[keyof typeof STATION];
}

export type FilterType = z.infer<typeof filtersSchema>;
