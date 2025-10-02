import z from "zod";

import { filtersSchema, updateItemDetailsSchema } from "./schema";

import type { Item } from "@/shared/types/item";
import type { Station } from "@/shared/types/station";
export interface CheckButtonProps {
  itemId: Item["id"];
  stationType: Station;
}

export type FilterType = z.infer<typeof filtersSchema>;

export type UpdateItemDetail = z.infer<typeof updateItemDetailsSchema>;
