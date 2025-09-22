import z from "zod";

import { filtersSchema, updateItemDetailsSchema } from "./schema";

import type { StationItemType, StationType } from "@/types/station";
export interface CheckButtonProps {
  isPendingReview: boolean;
  itemId: StationItemType["id"];
  status: StationItemType["status_code"];
  itemData?: StationItemType;
  stationType: StationType;
  isChangingStatusPending?: boolean;
}

export type FilterType = z.infer<typeof filtersSchema>;

export type UpdateItemDetail = z.infer<typeof updateItemDetailsSchema>;
