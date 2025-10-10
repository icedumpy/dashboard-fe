import { REVIEW_STATE } from '@/shared/constants/review';

export interface ReviewT {
  id: 5;
  type: string;
  state: string;
  submitted_by: number;
  submitted_at: string;
  submit_note: null;
  reviewed_by: null;
  reviewed_at: null;
  decision_note: null;
  item: Item;
  defects: Defect[];
}

export interface Item {
  id: number;
  station: string;
  line_id: number;
  product_code: string;
  number: string;
  job_order_number: string;
  roll_width: number;
  detected_at: string;
  ai_note: string;
  status: Status;
  is_item_history_exists: boolean;
}

export interface Status {
  id: number;
  code: string;
  name: string;
  display_order: number;
}

export interface Defect {
  id: number;
  defect_type_id: number;
  defect_type_code: string;
  defect_type_name: string;
  meta: Meta;
}

export interface Meta {
  source: string;
}

export type ReviewStateT = (typeof REVIEW_STATE)[keyof typeof REVIEW_STATE];

export interface ReviewSummaryT {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}
