import { describe, it, expect } from "vitest";
import { sanitizeQueryParams } from "@/shared/utils/sanitize-query-params";

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
    expect(result).toEqual({ h: "value" });
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
    expect(result).toEqual({});
  });

  it("should handle non-object input gracefully (error/edge case)", () => {
    // Act & Assert
    expect(sanitizeQueryParams(null)).toEqual({});
    expect(sanitizeQueryParams(undefined)).toEqual({});
    expect(sanitizeQueryParams("string")).toEqual({});
    expect(sanitizeQueryParams(123)).toEqual({});
    expect(sanitizeQueryParams([])).toEqual({});
  });

  it("should respect strict option when set to false", () => {
    // Arrange
    const params = {
      a: "",
      b: 0,
      c: false,
      d: "value",
      e: null,
      f: undefined,
    };
    // Act
    const result = sanitizeQueryParams(params, { strict: false });
    // Assert
    expect(result).toEqual({
      d: "value",
    });
  });

  it("should handle nested objects and arrays correctly", () => {
    // Arrange
    const params = {
      a: { nested: "value" },
      b: [1, 2, 3],
      c: [],
      d: {},
      e: "test",
    };
    // Act
    const result = sanitizeQueryParams(params);
    // Assert
    expect(result).toEqual({ a: { nested: "value" }, b: [1, 2, 3], e: "test" });
  });

  it("should preserve numeric zero when strict is false", () => {
    // Arrange
    const params = {
      count: 0,
      page: 1,
      name: "",
    };
    // Act
    const result = sanitizeQueryParams(params, { strict: false });
    // Assert
    expect(result).toEqual({
      page: 1,
    });
  });
});
