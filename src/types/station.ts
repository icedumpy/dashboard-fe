import { STATION, STATION_STATUS } from "@/contants/station";

import type { PaginationType } from "./pagination";
import type { ImageT } from "./image";

export type StationType = (typeof STATION)[keyof typeof STATION];

export interface StationItemType {
  id: number;
  station: (typeof STATION)[keyof typeof STATION];
  line_id: number;
  product_code?: string;
  roll_number?: string;
  bundle_number?: string;
  job_order_number?: string;
  roll_width?: number;
  detected_at: string;
  status_code: (typeof STATION_STATUS)[keyof typeof STATION_STATUS];
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
  is_changing_status_pending?: boolean;
}

export interface StationResponse {
  data: StationItemType[];
  pagination: PaginationType;
  summary: SummaryT;
}

export interface SummaryT {
  total: number;
  defects: number;
  scrap: number;
  pending_defect: number;
  pending_scrap: number;
}

export interface StationDetailResponse {
  data: StationItemType;
  defects?: { defect_type_code: string }[];
  images?: Images;
  reviews?: ReviewT[];
}

export interface Images {
  DETECTED: ImageT[];
  FIX: ImageT[];
  OTHER: ImageT[];
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
  reviewed_by_user?: ReviewedByUserT;
}

export interface ReviewedByUserT {
  id: number;
  username: string;
  display_name: string;
  role: string;
}

export interface ItemStatusHistoryT {
  id: number;
  event_type: string;
  actor: ActorT;
  from_status_id: unknown;
  from_status_code: (typeof STATION_STATUS)[keyof typeof STATION_STATUS];
  to_status_id: number;
  to_status_code?: (typeof STATION_STATUS)[keyof typeof STATION_STATUS];
  created_at: string;
  defects?: string[];
}

export interface ActorT {
  id: number;
  username: string;
  display_name: string;
}
