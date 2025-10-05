import { afterEach, describe, expect, it, vi } from "vitest";
import * as authHelpers from "@/shared/helpers/auth";
import * as cookieUtils from "@/shared/utils/cookie";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/shared/constants/auth";

vi.mock("@/shared/utils/cookie");

describe("Auth helpers", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("clearAuthSession", () => {
    it("should remove both access and refresh tokens", () => {
      authHelpers.clearAuthSession();
      expect(cookieUtils.removeCookie).toHaveBeenCalledWith(ACCESS_TOKEN);
      expect(cookieUtils.removeCookie).toHaveBeenCalledWith(REFRESH_TOKEN);
    });
  });

  describe("getAuthTokens", () => {
    it("should return access and refresh tokens from cookies", () => {
      (cookieUtils.getCookie as unknown as ReturnType<typeof vi.fn>)
        .mockImplementationOnce(() => "access")
        .mockImplementationOnce(() => "refresh");
      const tokens = authHelpers.getAuthTokens();
      expect(tokens).toEqual({
        accessToken: "access",
        refreshToken: "refresh",
      });
      expect(cookieUtils.getCookie).toHaveBeenCalledWith(ACCESS_TOKEN);
      expect(cookieUtils.getCookie).toHaveBeenCalledWith(REFRESH_TOKEN);
    });
  });

  describe("setAuthTokens", () => {
    it("should set both access and refresh tokens if refreshToken is provided", () => {
      authHelpers.setAuthTokens("access", "refresh");
      expect(cookieUtils.setCookie).toHaveBeenCalledWith(
        ACCESS_TOKEN,
        "access"
      );
      expect(cookieUtils.setCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN,
        "refresh"
      );
    });

    it("should set only access token if refreshToken is not provided", () => {
      authHelpers.setAuthTokens("access");
      expect(cookieUtils.setCookie).toHaveBeenCalledWith(
        ACCESS_TOKEN,
        "access"
      );
      expect(cookieUtils.setCookie).not.toHaveBeenCalledWith(
        REFRESH_TOKEN,
        expect.anything()
      );
    });
  });

  describe("isAuthenticated", () => {
    it("should return true if access token exists", () => {
      (
        cookieUtils.getCookie as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue("access");
      expect(authHelpers.isAuthenticated()).toBe(true);
      expect(cookieUtils.getCookie).toHaveBeenCalledWith(ACCESS_TOKEN);
    });

    it("should return false if access token does not exist", () => {
      (
        cookieUtils.getCookie as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(undefined);
      expect(authHelpers.isAuthenticated()).toBe(false);
      expect(cookieUtils.getCookie).toHaveBeenCalledWith(ACCESS_TOKEN);
    });
  });
});
