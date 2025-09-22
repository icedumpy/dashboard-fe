import { useQueryState } from "nuqs";
import { isEmpty } from "radash";
import { useMemo } from "react";

import { useAuth } from "@/hooks/auth/use-auth";
import { useProductionLineOptions } from "@/hooks/option/use-production-line-option";

export default function UseOperatorFilters() {
  const { user } = useAuth();
  const { data: productionLineOptions } = useProductionLineOptions();

  const defaultLineId = isEmpty(user?.line?.id)
    ? productionLineOptions?.[0]?.value ?? ""
    : String(user?.line?.id);

  const [product_code, setProductCode] = useQueryState("product_code", {
    defaultValue: "",
  });
  const [roll_id, setRollId] = useQueryState("roll_id", {
    defaultValue: "",
  });
  const [number, setNumber] = useQueryState("number", {
    defaultValue: "",
  });
  const [job_order_number, setJobOrderNumber] = useQueryState(
    "job_order_number",
    {
      defaultValue: "",
    }
  );
  const [roll_width_min, setRollWidthMin] = useQueryState("roll_width_min", {
    defaultValue: "",
  });
  const [roll_width_max, setRollWidthMax] = useQueryState("roll_width_max", {
    defaultValue: "",
  });
  const [status, setStatus] = useQueryState("status", {
    defaultValue: "",
  });
  const [detected_to, setDetectedTo] = useQueryState("detected_to", {
    defaultValue: "",
  });
  const [detected_from, setDetectedFrom] = useQueryState("detected_from", {
    defaultValue: "",
  });
  const [line_id, setLineId] = useQueryState("line_id", {
    defaultValue: defaultLineId,
  });

  const values = useMemo(
    () => ({
      product_code,
      number,
      roll_id,
      job_order_number,
      roll_width_min,
      roll_width_max,
      status,
      detected_to,
      detected_from,
      line_id: line_id || defaultLineId,
    }),
    [
      product_code,
      number,
      roll_id,
      job_order_number,
      roll_width_min,
      roll_width_max,
      status,
      detected_to,
      detected_from,
      line_id,
      defaultLineId,
    ]
  );

  const setters = useMemo(
    () => ({
      setProductCode,
      setRollId,
      setNumber,
      setJobOrderNumber,
      setRollWidthMin,
      setRollWidthMax,
      setStatus,
      setDetectedTo,
      setDetectedFrom,
      setLineId,
    }),
    [
      setDetectedFrom,
      setDetectedTo,
      setJobOrderNumber,
      setLineId,
      setNumber,
      setProductCode,
      setRollId,
      setRollWidthMax,
      setRollWidthMin,
      setStatus,
    ]
  );

  return { values, setters };
}
