import { STATUS } from "@/constants/status";

export type StatusT = (typeof STATUS)[keyof typeof STATUS];
