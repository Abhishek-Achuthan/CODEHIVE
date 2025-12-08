export type HeaderProps = {
  title: string;
};


export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export interface PaginatedResponse <T>{
    items : T[];
    totalItems:number;
    totalPages:number;
}

export type ListQueryParams<
TFilter = unknown,
TSort = unknown> = {
  filter?:TFilter;
  sortBy?:TSort;
  page?:number;
  limit?:number;
  search?:string;
  tags?:string[];
}