import { LOGIN, PROFILE } from "@/contants/api";
import axiosInstance from "@/lib/axios-instance";

import { LoginFormType } from "@/pages/login-page/types";

// Example auth service
export const AuthService = {
  login: async (credentials: LoginFormType) => {
    const response = await axiosInstance.post(LOGIN, credentials);
    return response.data;
  },
  getProfile: async () => {
    const response = await axiosInstance.get(PROFILE);
    return response.data;
  },
  refreshToken: async () => {
    const response = await axiosInstance.post("/auth/refresh");
    return response.data;
  },
};
