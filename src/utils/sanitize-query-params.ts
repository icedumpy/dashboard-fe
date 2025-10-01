import { isEmpty } from "radash";

export interface SanitizeOptions {
  strict?: boolean;
}

export const sanitizeQueryParams = (
  params: unknown,
  options: SanitizeOptions = {}
) => {
  if (!params || typeof params !== "object") {
    return {};
  }

  const { strict = true } = options;

  const filtered = Object.fromEntries(
    Object.entries(params as Record<string, unknown>).filter(([, value]) => {
      // Basic filtering
      if (isEmpty(value) || value === null || value === undefined) {
        return false;
      }

      // Strict filtering
      if (strict && (value === "" || value === 0 || value === false)) {
        return false;
      }

      return true;
    })
  );

  return filtered;
};
