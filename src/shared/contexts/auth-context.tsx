import { createContext } from "react";

import type { LoginForm } from "@/features/login/types";
import type { User } from "@/shared/types/auth";

export interface AuthContextType {
  user: User | null;
  login: (values: LoginForm) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
