import z from "zod";

import { filtersSchema, updateItemDetailsSchema } from "./schema";

import type { StationItemType, StationType } from "@/types/station";
export interface CheckButtonProps {
  itemId: StationItemType["id"];
  stationType: StationType;
}

export type FilterType = z.infer<typeof filtersSchema>;

export type UpdateItemDetail = z.infer<typeof updateItemDetailsSchema>;
