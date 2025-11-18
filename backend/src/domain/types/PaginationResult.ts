export type PaginationResult<E> = {
  items: E[];
  totalItems: number;
  totalPages: number;
};
