import { Student } from "./student.interface";

export interface FetchStudentsResponse {
  students: Student[];
  totalCount: number;
  page?: number;
  limit?: number;
}