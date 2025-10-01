import { ROLES } from "@/constants/auth";

export interface User {
  id: number;
  username: string;
  display_name: string;
  role: Role;
  is_active: boolean;
  line?: ProductionLine;
  shift?: Shift;
}

export interface ProductionLine {
  id: number;
  code: string;
  name: string;
}

export interface Shift {
  id: number;
  code: string;
  name: string;
  start_time: string;
  end_time: string;
}

export type Role = (typeof ROLES)[keyof typeof ROLES];
