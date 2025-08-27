import { STATION } from "@/contants/station";
import { PaginationType } from "./pagination";

export type StationType = (typeof STATION)[keyof typeof STATION];

export interface StationItemType {
  id: number;
  station: string;
  line_id: number;
  product_code?: string;
  roll_number?: string;
  bundle_number?: string;
  job_order_number?: string;
  roll_width?: number;
  detected_at: string;
  status_code: string;
  ai_note: string;
  scrap_requires_qc: boolean;
  scrap_confirmed_by?: number;
  scrap_confirmed_at?: string;
  current_review_id: string;
  images_count: number;
  defects_count: number;
  roll_data: unknown;
}

export interface StationResponse {
  data: StationItemType[];
  pagination: PaginationType;
}

export interface StationDetailResponse {
  data: StationItemType;
  defects?: unknown[];
  images?: Images;
  reviews?: unknown[];
}

export interface Images {
  DETECTED: ImageType[];
  FIX: ImageType[];
  OTHER: ImageType[];
}

export interface ImageType {
  id: number;
  path: string;
}
