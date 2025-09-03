export interface FetchStudentsParams {
  search?: string;
  currentPage?: number;     // mismo nombre que espera tu backend
  resultsPerPage?: number;  // idem
  orderBy?: string;         // "asc" | "desc" | "name:asc" etc, según tu API
}