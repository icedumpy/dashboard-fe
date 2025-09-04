export const sanitizeQueryParams = <T extends Record<string, unknown>>(
  params: T
): Partial<T> => {
  if (!params || typeof params !== "object" || Array.isArray(params)) {
    return {};
  }

  const isEmptyObject = (value: unknown) =>
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0;

  const filtered = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0) &&
        !isEmptyObject(value)
    )
  ) as Partial<T>;

  return Object.keys(filtered).length ? filtered : {};
};
