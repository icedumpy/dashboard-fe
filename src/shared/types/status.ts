import { STATUS } from "@/shared/constants/status";

export type StatusT = (typeof STATUS)[keyof typeof STATUS];
