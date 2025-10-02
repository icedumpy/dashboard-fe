import { OrderBy } from "@/shared/types/order";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";

export default function SortIcon({
  isSorted,
  orderBy,
}: {
  isSorted: boolean;
  orderBy?: OrderBy;
}) {
  if (!isSorted) {
    return <ChevronsUpDownIcon className="w-4 h-4 ml-1" />;
  } else if (orderBy === "asc") {
    return <ArrowUpIcon className="w-4 h-4 ml-1" />;
  } else {
    return <ArrowDownIcon className="w-4 h-4 ml-1" />;
  }
}
