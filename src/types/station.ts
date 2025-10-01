import { STATION } from "@/constants/station";

export type Station = (typeof STATION)[keyof typeof STATION];
