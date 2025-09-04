import { describe, it, vi, expect, afterEach } from "vitest";
import Cookies from "js-cookie";
import clearAuthSession from "./clear-auth-session";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/contants/auth";

describe("clearAuthSession", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should remove ACCESS_TOKEN and REFRESH_TOKEN cookies (success case)", () => {
    // Arrange
    const removeSpy = vi.spyOn(Cookies, "remove");
    // Act
    clearAuthSession();
    // Assert
    expect(removeSpy).toHaveBeenCalledWith(ACCESS_TOKEN);
    expect(removeSpy).toHaveBeenCalledWith(REFRESH_TOKEN);
  });

  it("should throw error if Cookies.remove fails (error case)", () => {
    // Arrange
    vi.spyOn(Cookies, "remove").mockImplementation(() => {
      throw new Error("Remove failed");
    });
    // Act & Assert
    expect(() => clearAuthSession()).toThrow("Remove failed");
  });

  it("should handle edge case: ACCESS_TOKEN and REFRESH_TOKEN are empty", () => {
    // Arrange
    const removeSpy = vi.spyOn(Cookies, "remove");
    // Act
    clearAuthSession();
    // Assert
    expect(removeSpy).toHaveBeenCalledWith(ACCESS_TOKEN);
    expect(removeSpy).toHaveBeenCalledWith(REFRESH_TOKEN);
  });
});
