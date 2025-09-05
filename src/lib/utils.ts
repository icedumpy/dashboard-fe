import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDetectedRange(from?: string | Date, to?: string | Date) {
  return {
    detected_from: from
      ? `${dayjs(from).format("YYYY-MM-DD")}T00:00:00.000000+00:00`
      : undefined,
    detected_to: to
      ? `${dayjs(to).format("YYYY-MM-DD")}T23:59:59.999999+00:00`
      : undefined,
  };
}
