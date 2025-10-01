import { LOGIN_ENDPOINT, PROFILE_ENDPOINT } from "@/constants/api";
import axiosInstance from "@/lib/axios-instance";

import { LoginForm } from "@/pages/login-page/types";

// Example auth service
export const AuthService = {
  login: async (credentials: LoginForm) => {
    const response = await axiosInstance.post(LOGIN_ENDPOINT, credentials);
    return response.data;
  },
  getProfile: async () => {
    const response = await axiosInstance.get(PROFILE_ENDPOINT);
    return response.data;
  },
  refreshToken: async () => {
    const response = await axiosInstance.post("/auth/refresh");
    return response.data;
  },
};
