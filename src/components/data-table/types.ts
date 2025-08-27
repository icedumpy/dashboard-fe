import { ColumnDef } from "@tanstack/react-table";

import type { PaginationType } from "@/types/pagination";

export type DataTableProps<T extends object> = {
  isLoading?: boolean;
  data: T[];
  columns: ColumnDef<T, unknown>[];
  pageSize?: number;
  pagination?: DataTablePaginationProps;
};

export interface DataTablePaginationProps extends PaginationType {
  onPageChange: (page: number) => void;
}
