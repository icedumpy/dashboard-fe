export interface ChangeStatusT {
  id: number;
  item_id: number;
  from_status_id: number;
  to_status_id: number;
  state: string;
  requested_by: number;
  requested_at: string;
  approved_by: number;
  approved_at: string;
  reason: string;
  meta: unknown;
  defect_type_ids: number[];
}

export interface ChangeStatusSummary {
  bundle: number;
  roll: number;
  total: number;
}
