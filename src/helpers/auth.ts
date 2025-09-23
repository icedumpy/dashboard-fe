import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/auth";
import { getCookie, removeCookie, setCookie } from "@/utils/cookie";

export function clearAuthSession() {
  removeCookie(ACCESS_TOKEN);
  removeCookie(REFRESH_TOKEN);
}

export function getAuthTokens() {
  return {
    accessToken: getCookie(ACCESS_TOKEN),
    refreshToken: getCookie(REFRESH_TOKEN),
  };
}

export function setAuthTokens(accessToken: string, refreshToken?: string) {
  setCookie(ACCESS_TOKEN, accessToken);
  if (refreshToken) {
    setCookie(REFRESH_TOKEN, refreshToken);
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getCookie(ACCESS_TOKEN));
}
