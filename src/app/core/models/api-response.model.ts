export interface PageableResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
  keyword?: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  status: number;
  timestamp?: string;
}