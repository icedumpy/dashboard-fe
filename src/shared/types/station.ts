import { STATION } from "@/shared/constants/station";

export type Station = (typeof STATION)[keyof typeof STATION];
