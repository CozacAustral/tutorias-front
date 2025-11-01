export type Filters = {
  from?: string;
  to?: string;
  studentId?: number;
  status?: "all" | "PENDING" | "REPORTMISSING" | "CONFIRMED";
  order?: "asc" | "desc";
};
