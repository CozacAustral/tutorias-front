import { Student } from "../../alumnos/interfaces/student.interface";

export interface FetchStudentsResponse {
  students: Student[];
  totalCount: number;
  page?: number;
  limit?: number;
}
