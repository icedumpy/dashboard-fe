import { parseAsString, useQueryStates } from "nuqs";
import { isEmpty } from "radash";

import { useAuth } from "@/hooks/auth/use-auth";
import { useProductionLineOptions } from "@/hooks/option/use-production-line-option";

export default function useItemFilters() {
  const { user } = useAuth();
  const { data: productionLineOptions } = useProductionLineOptions();

  const defaultLineId = isEmpty(user?.line?.id)
    ? productionLineOptions?.[0]?.value ?? ""
    : String(user?.line?.id);

  const [filters, setFilters] = useQueryStates({
    product_code: parseAsString.withDefault(""),
    number: parseAsString.withDefault(""),
    roll_id: parseAsString.withDefault(""),
    job_order_number: parseAsString.withDefault(""),
    roll_width_min: parseAsString.withDefault(""),
    roll_width_max: parseAsString.withDefault(""),
    status: parseAsString,
    detected_from: parseAsString.withDefault(""),
    detected_to: parseAsString.withDefault(""),
    line_id: parseAsString.withDefault(defaultLineId),
  });

  return { filters, setFilters };
}
