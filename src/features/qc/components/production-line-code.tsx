import { useProductionLineOptions } from "@/shared/hooks/option/use-production-line-option";

interface ProductionLineCodeProps {
  id: number;
}

export default function ProductionLineCode({ id }: ProductionLineCodeProps) {
  const { data } = useProductionLineOptions();
  const productionLineCode = data?.find((line) => Number(line.value) === id)
    ?.meta?.code;

  return <p>{productionLineCode ?? "Unknown"}</p>;
}
