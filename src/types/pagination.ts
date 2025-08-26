export interface PaginationType {
  page?: number;
  page_size?: number;
  total?: number;
  total_pages?: number;
  onPageChange?: (page: number) => void;
}
