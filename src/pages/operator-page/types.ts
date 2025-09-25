import z from "zod";

import { filtersSchema, updateItemDetailsSchema } from "./schema";

import type { StationItemType, StationType } from "@/types/station";
export interface CheckButtonProps {
  itemId: StationItemType["id"];
  // isPendingReview: boolean;
  // status: StationItemType["status_code"];
  stationType: StationType;
  // isChangingStatusPending?: boolean;
}

export type FilterType = z.infer<typeof filtersSchema>;

export type UpdateItemDetail = z.infer<typeof updateItemDetailsSchema>;
