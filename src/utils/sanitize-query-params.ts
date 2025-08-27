import { isEmpty } from "radash";

export const sanitizeQueryParams = (params: unknown) => {
  const filtered = Object.fromEntries(
    Object.entries(params as Record<string, unknown>).filter(
      ([, value]) => !isEmpty(value)
    )
  );
  return filtered;
};
