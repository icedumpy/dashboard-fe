import { useProductionLineOptions } from "@/hooks/option/use-production-line-option";

interface ProductionLineNameProps {
  id: number;
}

export default function ProductionLineName({ id }: ProductionLineNameProps) {
  const { data } = useProductionLineOptions();
  const productionLine = data?.find((line) => Number(line.value) === id);

  return <p>{productionLine?.label ?? "Unknown"}</p>;
}
