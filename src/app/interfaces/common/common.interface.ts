export interface Language {
  name: string;
  code: string;
}

export interface PaginationRequest {
  pageNumber: number;
  pageSize: number;
}

export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export class PaginatedResult<T> {
  result?: T;
  pagination?: Pagination
}
