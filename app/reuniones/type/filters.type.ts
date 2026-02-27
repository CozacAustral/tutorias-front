export type Filters = {
  from?: string;
  to?: string;
  studentId?: number;
  tutorId?: number;
  status?: "all" | "PENDING" | "REPORTMISSING" | "COMPLETED";
  order?: "asc" | "desc";
};
