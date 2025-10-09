import type { ImageT } from './image';
import type { Pagination } from './pagination';
import type { Station } from './station';
import type { StatusT } from './status';

export interface Item {
  id: number;
  station: Station;
  line_id: number;
  product_code?: string;
  roll_number?: string;
  bundle_number?: string;
  job_order_number?: string;
  roll_width?: number;
  detected_at: string;
  status_code: StatusT;
  status_name_th?: string;
  ai_note: string;
  acknowledged_by?: number;
  acknowledged_at?: string;
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

export interface ItemResponse {
  data: Item[];
  pagination: Pagination;
  summary: SummaryT;
}

export interface SummaryT {
  defect: number;
  normal: number;
  pending_defect: number;
  qc_passed: number;
  rejected: number;
  scrap: number;
  total: number;
}

export interface StationDetailResponse {
  data: Item;
  defects?: { defect_type_code: string }[];
  images?: Images;
  reviews?: ReviewT[];
}

export interface Images {
  DETECTED: ImageT[];
  FIX: ImageT[];
  OTHER: ImageT[];
}

export type IReviewState = 'APPROVED' | 'REJECTED';
export interface ReviewT {
  id: number;
  review_type: string;
  state: IReviewState;
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
  from_status_code: StatusT;
  to_status_id: number;
  to_status_code?: StatusT;
  created_at: string;
  before_defects?: string[];
  defects?: string[];
}

export interface ActorT {
  id: number;
  username: string;
  display_name: string;
}
