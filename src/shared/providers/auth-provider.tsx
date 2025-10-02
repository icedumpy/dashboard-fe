import { useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useLoginAPI } from "@/shared/hooks/auth/use-login";
import { useProfileAPI } from "@/shared/hooks/auth/use-profile";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/shared/constants/auth";
import { PROFILE_ENDPOINT } from "@/shared/constants/api";
import { AuthContext } from "@/shared/contexts/auth-context";
import { removeCookie, setCookie } from "@/shared/utils/cookie";

import type { LoginForm } from "@/features/login/types";
import type { AuthContextType } from "@/shared/contexts/auth-context";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const loginMutation = useLoginAPI();
  const { data: user, isLoading: profileLoading } = useProfileAPI();

  const login = useCallback(
    async (values: LoginForm): Promise<void> => {
      try {
        const data = await loginMutation.mutateAsync({
          username: values.username,
          password: values.password,
        });
        if (data) {
          setCookie(ACCESS_TOKEN, data.access_token);
          setCookie(REFRESH_TOKEN, data.refresh_token);

          queryClient.invalidateQueries({
            queryKey: [PROFILE_ENDPOINT],
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
    queryClient.setQueryData([PROFILE_ENDPOINT], null);
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
