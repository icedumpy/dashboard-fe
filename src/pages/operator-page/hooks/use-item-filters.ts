import { parseAsString, useQueryStates } from "nuqs";
import { isEmpty } from "radash";
import { useMemo } from "react";

import { useAuth } from "@/hooks/auth/use-auth";
import { useProductionLineOptions } from "@/hooks/option/use-production-line-option";

export default function useItemFilters() {
  const { user } = useAuth();
  const { data: productionLineOptions } = useProductionLineOptions();

  const defaultLineId = useMemo(() => {
    if (!isEmpty(user?.line?.id)) return String(user?.line?.id);
    return productionLineOptions?.[0]?.value ?? "";
  }, [user?.line?.id, productionLineOptions]);

  const [filters, setFilters] = useQueryStates({
    product_code: parseAsString.withDefault(""),
    number: parseAsString.withDefault(""),
    roll_id: parseAsString.withDefault(""),
    job_order_number: parseAsString.withDefault(""),
    roll_width_min: parseAsString.withDefault(""),
    roll_width_max: parseAsString.withDefault(""),
    status: parseAsString.withDefault(""),
    detected_from: parseAsString.withDefault(""),
    detected_to: parseAsString.withDefault(""),
    line_id: parseAsString.withDefault(""),
  });

  // Ensure line_id always has a value (from query or default)
  const mergedFilters = useMemo(
    () => ({
      ...filters,
      line_id: filters.line_id || defaultLineId,
    }),
    [filters, defaultLineId]
  );

  return {
    filters: mergedFilters,
    setFilters,
  };
}
