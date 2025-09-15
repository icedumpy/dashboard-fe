import { STATION_STATUS } from "@/contants/station";

export type StatusT = (typeof STATION_STATUS)[keyof typeof STATION_STATUS];
