import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Bangkok");

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDetectedRange(from?: string | Date, to?: string | Date) {
  return {
    detected_from: from ? dayjs(from).startOf("day").toISOString() : undefined,
    detected_to: to ? dayjs(to).endOf("day").toISOString() : undefined,
  };
}
