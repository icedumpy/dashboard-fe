import { describe, it, vi, expect, afterEach } from "vitest";
import Cookies from "js-cookie";
import getCookie from "./get-cookie";

vi.mock("js-cookie");

describe("getCookie", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return the correct cookie value (success case)", () => {
    // Arrange
    const getSpy = vi
      .spyOn(Cookies, "get")
      .mockReturnValue({ cookie: "cookie-value" });
    // Act
    const value = getCookie("my-cookie");
    // Assert
    expect(getSpy).toHaveBeenCalledWith("my-cookie");
    expect(value).toEqual({ cookie: "cookie-value" });
    getSpy.mockRestore();
  });

  it("should return undefined for non-existent cookie (edge case)", () => {
    // Arrange
    const getSpy = vi
      .spyOn(Cookies, "get")
      .mockReturnValue({ "cookie-value": "" });
    // Act
    const value = getCookie("not-set");
    // Assert
    expect(getSpy).toHaveBeenCalledWith("not-set");
    expect(value).toEqual({ "cookie-value": "" });
    getSpy.mockRestore();
  });

  it("should throw error if Cookies.get throws (error case)", () => {
    // Arrange
    const getSpy = vi.spyOn(Cookies, "get").mockImplementation(() => {
      throw new Error("Get failed");
    });
    // Act & Assert
    expect(() => getCookie("fail")).toThrow("Get failed");
    getSpy.mockRestore();
  });
});
