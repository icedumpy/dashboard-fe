import { STATION } from "@/contants/station";

import type { PaginationType } from "./pagination";

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
  status_code:
    | "DEFECT"
    | "REJECTED"
    | "NORMAL"
    | "RECHECK"
    | "QC_PASS"
    | "SCRAP";
  ai_note: string;
  scrap_requires_qc: boolean;
  scrap_confirmed_by?: number;
  scrap_confirmed_at?: string;
  current_review_id: string;
  images_count: number;
  defects_count: number;
  roll_data: unknown;
  roll_id?: string;
  is_pending_review: boolean;
  images: number;
  defects: string[];
}

export interface StationResponse {
  data: StationItemType[];
  pagination: PaginationType;
}

export interface StationDetailResponse {
  data: StationItemType;
  defects?: { defect_type_code: string }[];
  images?: Images;
  reviews?: ReviewT[];
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

export interface ReviewT {
  id: number;
  review_type: string;
  state: string;
  submitted_by: number;
  submitted_at: string;
  reviewed_by: string;
  reviewed_at: string;
  submit_note: string;
  review_note: string;
  reject_reason: string;
}
