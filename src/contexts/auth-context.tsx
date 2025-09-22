import { createContext } from "react";

import type { LoginFormType } from "@/pages/login-page/types";
import type { UserType } from "@/types/auth";

export interface AuthContextType {
  user: UserType | null;
  login: (values: LoginFormType) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
