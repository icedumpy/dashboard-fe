import React, { useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

import removeCookie from "@/utils/remove-cookie";
import setCookie from "@/utils/set-cookie";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/contants/auth";
import { useLoginAPI } from "@/hooks/auth/use-login";
import { useProfileAPI } from "@/hooks/auth/use-profile";
import { AuthContext } from "@/hooks/auth/use-auth";
import { PROFILE } from "@/contants/api";

import type { LoginFormType } from "@/pages/login-page/types";
import type { UserType } from "@/types/auth";

export interface AuthContextType {
  user: UserType | null;
  login: (values: LoginFormType) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const loginMutation = useLoginAPI();
  const { data: user, isLoading: profileLoading } = useProfileAPI();

  const login = useCallback(
    async (values: LoginFormType): Promise<void> => {
      try {
        const data = await loginMutation.mutateAsync({
          username: values.username,
          password: values.password,
        });
        if (data) {
          setCookie(ACCESS_TOKEN, data.access_token);
          setCookie(REFRESH_TOKEN, data.refresh_token);

          queryClient.invalidateQueries({
            queryKey: [PROFILE],
          });
        }
      } catch (error: unknown) {
        console.error("Login error:", error);
        // error handled by loginMutation.error
      }
    },
    [loginMutation, queryClient]
  );

  const logout = useCallback(() => {
    removeCookie(ACCESS_TOKEN);
    removeCookie(REFRESH_TOKEN);
    queryClient.setQueryData([PROFILE], null);
  }, [queryClient]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      login,
      logout,
      isLoading: loginMutation.isPending || profileLoading,
      error: loginMutation.error?.message || null,
    }),
    [
      user,
      login,
      logout,
      loginMutation.isPending,
      loginMutation.error?.message,
      profileLoading,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
