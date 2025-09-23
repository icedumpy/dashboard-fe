import axios from "axios";
import qs from "qs";

import { API_V1 } from "@/constants/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/auth";
import { ApiError } from "@/utils/api-error";
import clearAuthSession from "@/utils/clear-auth-session";
import getCookie from "@/utils/get-cookie";
import setCookie from "@/utils/set-cookie";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + API_V1,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
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
          { refresh_token: refreshToken },
          { withCredentials: true }
        );
        const newAccessToken = res.data?.access_token;
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

    // Handle blob error responses (e.g. image API)
    if (
      error.response?.config?.responseType === "blob" &&
      error.response?.headers["content-type"] === "application/json"
    ) {
      try {
        const text = await error.response.data.text();
        const json = JSON.parse(text);
        const message =
          json.detail || json.message || error.message || "Unexpected error";
        return Promise.reject(new Error(message));
      } catch {
        return Promise.reject(new Error(error.message || "Unexpected error"));
      }
    }

    return Promise.reject(new ApiError(error));
  }
);

export default axiosInstance;
