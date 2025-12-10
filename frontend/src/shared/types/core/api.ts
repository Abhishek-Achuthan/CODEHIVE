export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
}

export type ListQueryParams<
  TFilter = unknown,
  TSort = unknown
> = {
  filter?: TFilter;
  sortBy?: TSort;
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
};

