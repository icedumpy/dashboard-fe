export interface UserType {
  id: number;
  username: string;
  display_name: string;
  role: string;
  is_active: boolean;
  line: LineType;
  shift: ShiftType;
}

export interface LineType {
  id: number;
  code: string;
  name: string;
}

export interface ShiftType {
  id: number;
  code: string;
  name: string;
  start_time: string;
  end_time: string;
}
