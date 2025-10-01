import { ColumnDef } from "@tanstack/react-table";

import type { Pagination } from "@/types/pagination";
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

export interface DataTablePaginationProps extends Pagination {
  onPageChange: (page: number) => void;
}
