import React from "react";
import { isEmpty } from "radash";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import DataTablePagination from "./data-table-pagination";
import SortIcon from "./components/sort-icon";
import { Button } from "@/shared/components/ui/button";
import DataTableSkeleton from "./components/data-table-skeleton";
import DataTableEmpty from "./components/data-table-empty";

import { cn } from "@/lib/utils";
import { ORDER_BY } from "@/shared/constants/order";

import type { DataTableProps } from "./types";

export function DataTable<T extends object>({
  data,
  columns,
  isLoading,
  pagination,
  sorting,
}: DataTableProps<T>) {
  const [pageIndex, setPageIndex] = React.useState(0);

  const pageSize = pagination?.page_size ?? 10;

  const handleSortClick = React.useCallback(
    (columnId: string) => {
      if (!sorting) return;
      const isCurrentlySorted = sorting.sortBy === columnId;
      if (!isCurrentlySorted) {
        // Not sorted: set to DESC
        sorting.onSortChange?.({ sortBy: columnId, orderBy: ORDER_BY.DESC });
      } else if (sorting.orderBy === ORDER_BY.DESC) {
        // DESC: set to ASC
        sorting.onSortChange?.({ sortBy: columnId, orderBy: ORDER_BY.ASC });
      } else {
        // ASC: reset sort
        sorting.onSortChange?.({ sortBy: undefined, orderBy: undefined });
      }
    },
    [sorting]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination: { pageIndex, pageSize },
    },
    getRowId: (row, index) => {
      if (
        "id" in row &&
        (typeof row.id === "string" || typeof row.id === "number")
      ) {
        return String(row.id);
      }
      return `row-${index}`;
    },
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

  return (
    <div className="overflow-hidden border rounded-md">
      <Table>
        <TableHeader className="bg-accent">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const enableSorting =
                  header.column.columnDef.enableSorting ?? false;
                const isSorted = header.id === sorting?.sortBy;

                if (enableSorting) {
                  return (
                    <TableHead key={header.id} className="px-3 py-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="p-0! shadow-none cursor-pointer"
                        onClick={() => handleSortClick(header.column.id)}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <SortIcon
                          isSorted={isSorted}
                          orderBy={sorting?.orderBy}
                        />
                      </Button>
                    </TableHead>
                  );
                }

                return (
                  <TableHead key={header.id} className="px-3 py-1">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <DataTableSkeleton col={columns.length} rows={pageSize / 2} />
          ) : table.getRowModel().rows.length === 0 ? (
            <DataTableEmpty columns={columns} />
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
                      className={cn("px-3 py-2", metaClass)}
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
