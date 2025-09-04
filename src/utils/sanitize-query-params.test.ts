import { describe, it, expect } from "vitest";
import { sanitizeQueryParams } from "./sanitize-query-params";

describe("sanitizeQueryParams", () => {
  it("should remove keys with empty values (success case)", () => {
    // Arrange
    const params = {
      a: "",
      b: null,
      c: undefined,
      d: [],
      e: {},
      f: 0,
      g: false,
      h: "value",
    };
    // Act
    const result = sanitizeQueryParams(params);
    // Assert
    expect(result).toEqual({ f: 0, g: false, h: "value" });
  });

  it("should return undefined if all values are empty (edge case)", () => {
    // Arrange
    const params = {
      a: "",
      b: null,
      c: undefined,
      d: [],
      e: {},
    };
    // Act
    const result = sanitizeQueryParams(params);
    // Assert
    expect(result).toEqual({});
  });

  it("should return the same object if no values are empty (success case)", () => {
    // Arrange
    const params = {
      a: 1,
      b: "test",
      c: true,
    };
    // Act
    const result = sanitizeQueryParams(params);
    // Assert
    expect(result).toEqual({
      a: 1,
      b: "test",
      c: true,
    });
  });

  it("should not remove values that are falsy but not empty (edge case)", () => {
    // Arrange
    const params = {
      a: 0,
      b: false,
      c: "",
      d: null,
    };
    // Act
    const result = sanitizeQueryParams(params);
    // Assert
    expect(result).toEqual({ a: 0, b: false });
  });

  it("should handle non-object input gracefully (error/edge case)", () => {
    // Act & Assert
    expect(sanitizeQueryParams({})).toEqual({});
  });
});
