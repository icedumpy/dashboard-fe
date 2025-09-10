import React from "react";
import { isEmpty } from "radash";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DataTablePagination from "./data-table-pagination";

import { cn } from "@/lib/utils";

import type { DataTableProps } from "./types";

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
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="px-4 py-2">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className="p-4 text-center text-muted-foreground">
                  No results.
                </div>
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="border-t">
                {row.getVisibleCells().map((cell) => {
                  const metaClass =
                    (cell.column.columnDef.meta as { className?: string })
                      ?.className ?? "";
                  return (
                    <TableCell
                      key={cell.id}
                      className={cn("px-4 py-2", metaClass)}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {!isEmpty(pagination) && (
        <div className="flex items-center justify-between w-full p-2 border-t">
          <div>
            <p className="space-x-1 text-sm">
              <span>แสดง</span>
              <span>
                {isEmpty(pagination?.total)
                  ? "0"
                  : (Number(pagination?.page) - 1) * pageSize + 1}
              </span>
              <span>ถึง</span>
              <span>
                {pagination && Number(pagination.page) > 0
                  ? Math.min(
                      Number(pagination.page) * pageSize,
                      pagination.total || 0
                    )
                  : 0}
              </span>
              <span>จากทั้งหมด {pagination?.total ?? 0} ข้อมูล</span>
            </p>
          </div>
          <DataTablePagination
            {...pagination}
            onPageChange={pagination?.onPageChange ?? (() => {})}
          />
        </div>
      )}
    </div>
  );
}
