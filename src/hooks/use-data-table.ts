import { useCallback, useMemo, useState } from "react";
import { parseAsInteger, useQueryState } from "nuqs";

import type { OrderBy } from "@/types/order";

interface UseDataTableOptions {
  pageQueryKey?: string;
  defaultSortBy?: string;
  defaultOrderBy?: OrderBy;
  resetPageOnFiltersChange?: boolean;
}

interface PaginationData {
  page?: number;
  totalPages?: number;
  totalRows?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

interface UseDataTableReturn {
  // State
  page: number;
  sortBy?: string;
  orderBy?: OrderBy;

  // Setters
  setPage: (page: number) => void;
  setSortBy: (sortBy: string) => void;
  setOrderBy: (orderBy: OrderBy) => void;

  // Handlers
  handlePageChange: (page: number) => void;
  handleSortChange: ({
    sortBy,
    orderBy,
  }: {
    sortBy?: string;
    orderBy?: OrderBy;
  }) => void;

  // Reset functions
  resetPage: () => void;
  resetSort: () => void;
  resetAll: () => void;

  // Props for DataTable
  sortingProps: {
    sortBy?: string;
    orderBy?: OrderBy;
    onSortChange: ({
      sortBy,
      orderBy,
    }: {
      sortBy?: string;
      orderBy?: OrderBy;
    }) => void;
  };

  paginationProps: (pagination?: PaginationData) => PaginationData & {
    onPageChange: (page: number) => void;
  };
}

export function useDataTable(
  options: UseDataTableOptions = {}
): UseDataTableReturn {
  const {
    pageQueryKey = "page",
    defaultSortBy = undefined,
    defaultOrderBy = undefined,
    resetPageOnFiltersChange = false,
  } = options;

  // Query states
  const [page, setPageState] = useQueryState(
    pageQueryKey,
    parseAsInteger.withDefault(1)
  );

  const [sortBy, setSortByState] = useState<string | undefined>(defaultSortBy);
  const [orderBy, setOrderByState] = useState<OrderBy | undefined>(
    defaultOrderBy
  );

  // Memoized handlers
  const handlePageChange = useCallback(
    (newPage: number) => {
      setPageState(newPage);
    },
    [setPageState]
  );

  const handleSortChange = useCallback(
    ({ sortBy, orderBy }: { sortBy?: string; orderBy?: OrderBy }) => {
      setSortByState(sortBy);
      setOrderByState(orderBy);

      // Reset to first page when sorting changes
      if (resetPageOnFiltersChange) {
        setPageState(1);
      }
    },
    [setPageState, resetPageOnFiltersChange]
  );

  // Reset functions
  const resetPage = useCallback(() => {
    setPageState(1);
  }, [setPageState]);

  const resetSort = useCallback(() => {
    setSortByState(defaultSortBy);
    setOrderByState(defaultOrderBy);
  }, [defaultSortBy, defaultOrderBy]);

  const resetAll = useCallback(() => {
    resetPage();
    resetSort();
  }, [resetPage, resetSort]);

  // Memoized props
  const sortingProps = useMemo(
    () => ({
      sortBy,
      orderBy,
      onSortChange: handleSortChange,
    }),
    [sortBy, orderBy, handleSortChange]
  );

  const paginationProps = useCallback(
    (pagination: PaginationData = {}) => ({
      ...pagination,
      onPageChange: handlePageChange,
    }),
    [handlePageChange]
  );

  return {
    // State
    page,
    sortBy,
    orderBy,

    // Setters
    setPage: setPageState,
    setSortBy: setSortByState,
    setOrderBy: setOrderByState,

    // Handlers
    handlePageChange,
    handleSortChange,

    // Reset functions
    resetPage,
    resetSort,
    resetAll,

    // Props
    sortingProps,
    paginationProps,
  };
}

export default useDataTable;
