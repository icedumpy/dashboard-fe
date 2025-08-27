import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

import type { DataTablePaginationProps } from "./types";

export default function DataTablePagination(
  pagination: DataTablePaginationProps
) {
  const currentPage = pagination.page ?? 1;
  const totalPages =
    pagination.total_pages ??
    Math.ceil((pagination.total ?? 0) / (pagination.page_size ?? 10));

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
      pageNumbers.push(-1);
      for (let i = totalPages - 2; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      pageNumbers.push(-1);
      pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
      pageNumbers.push(-2);
      pageNumbers.push(totalPages);
    }
  }

  return (
    <Pagination className="m-0 w-fit">
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              currentPage > 1 && pagination.onPageChange?.(currentPage - 1)
            }
            disabled={currentPage <= 1}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : 0}
          >
            <ChevronLeftIcon />
          </Button>
        </PaginationItem>
        {pageNumbers.map((num, idx) =>
          num < 0 ? (
            <PaginationItem key={"ellipsis" + idx}>
              <span className="px-2">...</span>
            </PaginationItem>
          ) : (
            <PaginationItem key={num}>
              <Button
                variant={"outline"}
                size="icon"
                disabled={num === currentPage}
                onClick={() => pagination.onPageChange?.(num)}
                aria-current={num === currentPage ? "page" : undefined}
              >
                {num}
              </Button>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              currentPage < totalPages &&
              pagination.onPageChange?.(currentPage + 1)
            }
            disabled={currentPage >= totalPages}
            aria-disabled={currentPage >= totalPages}
            tabIndex={currentPage >= totalPages ? -1 : 0}
          >
            <ChevronRightIcon />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
