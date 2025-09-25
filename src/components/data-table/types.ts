import { ColumnDef } from "@tanstack/react-table";

import type { PaginationType } from "@/types/pagination";
import type { OrderBy } from "@/types/order";

export type DataTableProps<T extends object> = {
  isLoading?: boolean;
  data: T[];
  columns: ColumnDef<T>[];
  pageSize?: number;
  pagination?: DataTablePaginationProps;
  sorting?: {
    sortBy?: string;
    orderBy?: OrderBy;
    onSortChange: (value: { sortBy?: string; orderBy?: OrderBy }) => void;
  };
};

export interface DataTablePaginationProps extends PaginationType {
  onPageChange: (page: number) => void;
}
