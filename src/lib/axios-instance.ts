import axios from "axios";
import qs from "qs";

import { API_V1, REFRESH_TOKEN_ENDPOINT } from "@/shared/constants/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/shared/constants/auth";
import { ApiError } from "@/shared/utils/api-error";
import { clearAuthSession } from "@/shared/helpers/auth";
import { getCookie, setCookie } from "@/shared/utils/cookie";
import { sanitizeQueryParams } from "@/shared/utils/sanitize-query-params";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + API_V1,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => {
    const filteredParams = sanitizeQueryParams(params);
    return qs.stringify(filteredParams, { arrayFormat: "repeat" });
  },
});

// Global variable to store refresh promise
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });

  failedQueue = [];
};

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

    if (error.response?.status === 401 && getCookie(REFRESH_TOKEN)) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getCookie(REFRESH_TOKEN);
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL + API_V1 + REFRESH_TOKEN_ENDPOINT}`,
          { refresh_token: refreshToken },
          { withCredentials: true }
        );

        const newAccessToken = res.data?.access_token;
        if (newAccessToken) {
          setCookie(ACCESS_TOKEN, newAccessToken);
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } else {
          processQueue(new Error("No access token received"), null);
          clearAuthSession();
          window.location.href = "/login";
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthSession();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
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
