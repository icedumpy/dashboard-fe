import { describe, it, vi, expect, afterEach } from "vitest";
import Cookies from "js-cookie";
import removeCookie from "./remove-cookie";

describe("removeCookie", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should remove the specified cookie (success case)", () => {
    // Arrange
    const removeSpy = vi.spyOn(Cookies, "remove");
    // Act
    removeCookie("my-cookie");
    // Assert
    expect(removeSpy).toHaveBeenCalledWith("my-cookie");
    removeSpy.mockRestore();
  });

  it("should throw error if Cookies.remove fails (error case)", () => {
    // Arrange
    vi.spyOn(Cookies, "remove").mockImplementation(() => {
      throw new Error("Remove failed");
    });
    // Act & Assert
    expect(() => removeCookie("fail-cookie")).toThrow("Remove failed");
  });

  it("should handle edge case: empty cookie name", () => {
    // Arrange
    const removeSpy = vi.spyOn(Cookies, "remove");
    // Act
    removeCookie("");
    // Assert
    expect(removeSpy).toHaveBeenCalledWith("");
    removeSpy.mockRestore();
  });

  it("should handle error if Cookies.remove throws (error case)", () => {
    const removeSpy = vi.spyOn(Cookies, "remove").mockImplementation(() => {
      throw new Error("Remove failed");
    });
    expect(() => removeCookie("my-cookie")).toThrow("Remove failed");
    removeSpy.mockRestore();
  });
});
