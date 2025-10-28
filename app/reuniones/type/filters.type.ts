export type Filters = {
  from?: string;
  to?: string;
  studentId?: number;
  // studentQuery?: string; // 🔸 eliminado del UI (se mantiene afuera si tu API lo usa en otros lugares)
  status?: "all" | "PENDING" | "REPORTMISSING" | "CONFIRMED";
  order?: "asc" | "desc";
};
