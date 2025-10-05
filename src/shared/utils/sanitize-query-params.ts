import { isEmpty } from "radash";

/**
 * Cleans up an object by removing keys with empty, null, or undefined values.
 * - If `strict` is true (default), also removes keys with "", 0, or false.
 * - If `strict` is false, only removes keys with nullish/empty values.
 *
 * @param params - The object to sanitize (should be a plain object)
 * @param options - { strict?: boolean }
 * @returns A new object with unwanted keys removed
 */
export function sanitizeQueryParams(
  params: unknown,
  options: { strict?: boolean } = { strict: true }
): Record<string, unknown> {
  if (params === null || typeof params !== "object" || Array.isArray(params)) {
    return {};
  }

  const { strict = true } = options;

  return Object.fromEntries(
    Object.entries(params as Record<string, unknown>).filter(([, value]) => {
      if (value === null || value === undefined) return false;
      if (isEmpty(value)) return false;
      if (strict && (value === "" || value === 0 || value === false))
        return false;
      return true;
    })
  );
}
