import { STATUS } from "@/contants/status";

export type StatusT = (typeof STATUS)[keyof typeof STATUS];
