import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import * as cookieUtils from "@/shared/utils/cookie";
import Cookies from "js-cookie";

vi.mock("js-cookie");

describe("cookie utils", () => {
  const mockCookies: Record<string, string> = {};

  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(mockCookies).forEach((key) => delete mockCookies[key]);
    (Cookies.get as Mock).mockImplementation((name?: string) => {
      if (name) return mockCookies[name];
      return { ...mockCookies };
    });
    (Cookies.set as Mock).mockImplementation((name, value) => {
      mockCookies[name] = value;
    });
    (Cookies.remove as Mock).mockImplementation((name) => {
      delete mockCookies[name];
    });
  });

  it("getCookie returns the cookie value", () => {
    mockCookies["token"] = "abc";
    expect(cookieUtils.getCookie("token")).toBe("abc");
  });

  it("setCookie sets the cookie value", () => {
    cookieUtils.setCookie("session", "xyz");
    expect(mockCookies["session"]).toBe("xyz");
  });

  it("removeCookie removes the cookie", () => {
    mockCookies["user"] = "fadlan";
    cookieUtils.removeCookie("user");
    expect(mockCookies["user"]).toBeUndefined();
  });

  it("getAllCookies returns all cookies", () => {
    mockCookies["a"] = "1";
    mockCookies["b"] = "2";
    expect(cookieUtils.getAllCookies()).toEqual({ a: "1", b: "2" });
  });

  it("hasCookie returns true if cookie exists", () => {
    mockCookies["foo"] = "bar";
    expect(cookieUtils.hasCookie("foo")).toBe(true);
  });

  it("hasCookie returns false if cookie does not exist", () => {
    expect(cookieUtils.hasCookie("notfound")).toBe(false);
  });

  it("setCookie passes options to Cookies.set", () => {
    const options = { expires: 7 };
    cookieUtils.setCookie("opt", "val", options);
    expect(Cookies.set).toHaveBeenCalledWith("opt", "val", options);
  });

  it("removeCookie passes options to Cookies.remove", () => {
    const options = { path: "/" };
    cookieUtils.removeCookie("opt", options);
    expect(Cookies.remove).toHaveBeenCalledWith("opt", options);
  });
});
