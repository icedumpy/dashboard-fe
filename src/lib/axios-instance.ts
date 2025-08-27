import axios from "axios";

import getCookie from "@/utils/get-cookie";
import setCookie from "@/utils/set-cookie";
import clearAuthSession from "@/utils/clear-auth-session";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/contants/auth";
import { API_V1 } from "@/contants/api";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + API_V1,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getCookie(REFRESH_TOKEN)
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = getCookie(REFRESH_TOKEN);
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL + API_V1}/auth/refresh`,
          { refresh_Token: refreshToken },
          { withCredentials: true }
        );
        const newAccessToken = res.data?.data?.accessToken;
        if (newAccessToken) {
          setCookie(ACCESS_TOKEN, newAccessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } else {
          clearAuthSession();
          window.location.href = "/login";
        }
      } catch (refreshError) {
        clearAuthSession();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    // 🔹 ดึงข้อความจาก response
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "Unexpected error";

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
