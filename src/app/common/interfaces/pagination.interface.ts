//sorting request for server
export interface SortingRequest{
  fieldName: string;
  isDescending : boolean;
}

//Basic server request for paginating
export interface PaginationRequest extends SortingRequest {
  pageNumber: number;
  pageSize: number;
}

//Pagination basic datas for client
export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

//Pagnation interface for client with list items
export interface PaginatedResult<T> {
  result: T[];
  pagination: Pagination
}

//pagination server response
export interface PagedList<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}



