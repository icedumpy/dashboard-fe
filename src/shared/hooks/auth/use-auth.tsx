import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import axiosInstance from "@/lib/axios-instance";
import { getCookie, setCookie } from "@/shared/utils/cookie";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/shared/constants/auth";
import { LOGIN_ENDPOINT, PROFILE_ENDPOINT } from "@/shared/constants/api";
import { clearAuthSession } from "@/shared/helpers/auth";

import type { LoginForm } from "@/features/login/types";
import type { User } from "@/shared/types/auth";

// Auth API functions
const authApi = {
  login: async (credentials: LoginForm) => {
    const response = await axiosInstance.post(LOGIN_ENDPOINT, credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get(PROFILE_ENDPOINT);
    return response.data;
  },

  logout: async () => {
    clearAuthSession();
  },
};

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Get current user query
  const { data: user, isLoading } = useQuery({
    queryKey: [PROFILE_ENDPOINT],
    queryFn: authApi.getCurrentUser,
    enabled: !!getCookie(ACCESS_TOKEN),
    retry: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      setCookie(ACCESS_TOKEN, data.access_token);
      setCookie(REFRESH_TOKEN, data.refresh_token);
      queryClient.invalidateQueries({ queryKey: [PROFILE_ENDPOINT] });
      navigate("/");
    },
  });

  const logout = () => {
    clearAuthSession();
    queryClient.clear();
    navigate("/login", { replace: true });
    // window.location.href = "/login";
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    logout: logout,
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
  };
}
