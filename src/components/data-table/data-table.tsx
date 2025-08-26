import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import type { PaginationType } from "@/types/pagination";

export type DataTableProps<T extends object> = {
  isLoading?: boolean;
  data: T[];
  columns: ColumnDef<T, unknown>[];
  pageSize?: number;
  pagination?: PaginationType;
};

export function DataTable<T extends object>({
  data,
  columns,
  isLoading,
  pagination,
}: DataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pageIndex, setPageIndex] = React.useState(0);

  const pageSize = pagination?.page_size ?? 10;

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination: { pageIndex, pageSize },
    },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(next.pageIndex);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    manualSorting: false,
    pageCount: Math.ceil(data.length / pageSize),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-hidden border rounded-md">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-2 cursor-pointer">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getCanSort() && (
                    <span>
                      {header.column.getIsSorted() === "asc"
                        ? " ▲"
                        : header.column.getIsSorted() === "desc"
                        ? " ▼"
                        : ""}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>No data</td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex items-end justify-end p-2 border-t">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  table.getCanPreviousPage() &&
                  pagination?.onPageChange &&
                  pagination.onPageChange((pagination.page ?? pageIndex) - 1)
                }
                aria-disabled={!table.getCanPreviousPage()}
                tabIndex={!table.getCanPreviousPage() ? -1 : 0}
              />
            </PaginationItem>
            {(() => {
              const totalPages = pagination
                ? Math.ceil(
                    (pagination.total ?? 0) / (pagination.page_size ?? 10)
                  )
                : table.getPageCount();
              const currentPage = pagination
                ? pagination.page ?? 1
                : pageIndex + 1;
              const pageNumbers: number[] = [];
              if (totalPages <= 5) {
                for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
              } else {
                if (currentPage <= 3) {
                  pageNumbers.push(1, 2, 3);
                  pageNumbers.push(-1); // ellipsis
                  pageNumbers.push(totalPages);
                } else if (currentPage >= totalPages - 2) {
                  pageNumbers.push(1);
                  pageNumbers.push(-1); // ellipsis
                  for (let i = totalPages - 2; i <= totalPages; i++)
                    pageNumbers.push(i);
                } else {
                  pageNumbers.push(1);
                  pageNumbers.push(-1); // ellipsis
                  pageNumbers.push(
                    currentPage - 1,
                    currentPage,
                    currentPage + 1
                  );
                  pageNumbers.push(-2); // ellipsis
                  pageNumbers.push(totalPages);
                }
              }
              return pageNumbers.map((num, idx) => {
                if (num === -1 || num === -2) {
                  return (
                    <PaginationItem key={"ellipsis" + idx}>
                      <span className="px-2">...</span>
                    </PaginationItem>
                  );
                }
                return (
                  <PaginationItem key={num}>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={num === currentPage}
                      onClick={() => {
                        if (pagination?.onPageChange) {
                          pagination.onPageChange(num);
                        }
                      }}
                      aria-current={num === currentPage ? "page" : undefined}
                    >
                      {num}
                    </Button>
                  </PaginationItem>
                );
              });
            })()}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  table.getCanNextPage() &&
                  pagination?.onPageChange &&
                  pagination.onPageChange((pagination?.page ?? pageIndex) + 1)
                }
                aria-disabled={!table.getCanNextPage()}
                tabIndex={!table.getCanNextPage() ? -1 : 0}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
