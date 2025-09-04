import { describe, it, vi, expect, afterEach } from "vitest";
import Cookies from "js-cookie";
import setCookie from "./set-cookie";

describe("setCookie", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should set the specified cookie with the correct value (success case)", () => {
    // Arrange
    const setSpy = vi.spyOn(Cookies, "set");
    // Act
    setCookie("my-cookie", "cookie-value");
    // Assert
    expect(setSpy).toHaveBeenCalledWith("my-cookie", "cookie-value");
    setSpy.mockRestore();
  });

  it("should throw error if Cookies.set fails (error case)", () => {
    // Arrange
    vi.spyOn(Cookies, "set").mockImplementation(() => {
      throw new Error("Set failed");
    });
    // Act & Assert
    expect(() => setCookie("fail-cookie", "value")).toThrow("Set failed");
  });

  it("should handle edge case: empty cookie name and value", () => {
    // Arrange
    const setSpy = vi.spyOn(Cookies, "set");
    // Act
    setCookie("", "");
    // Assert
    expect(setSpy).toHaveBeenCalledWith("", "");
    setSpy.mockRestore();
  });
});
