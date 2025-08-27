export interface ItemSummaryResponse {
  shift: Shift;
  roll: Roll;
  bundle: Bundle;
}

export interface Shift {
  start_local: string;
  end_local: string;
  start_utc: string;
  end_utc: string;
  tz: string;
}

export interface Roll {
  total: number;
  defects: number;
  scrap: number;
  pending_defect: number;
  pending_scrap: number;
}

export interface Bundle {
  total: number;
  defects: number;
  scrap: number;
  pending_defect: number;
  pending_scrap: number;
}
