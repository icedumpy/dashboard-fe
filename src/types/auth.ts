import { ROLES } from "@/constants/auth";

export interface UserType {
  id: number;
  username: string;
  display_name: string;
  role: RoleType;
  is_active: boolean;
  line?: LineType;
  shift?: ShiftType;
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

export type RoleType = (typeof ROLES)[keyof typeof ROLES];
