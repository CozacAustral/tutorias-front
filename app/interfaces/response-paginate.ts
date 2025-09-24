import { Student } from "../alumnos/interfaces/student.interface";

export interface ResponsePaginateStudent {
  students: Student[];
  totalCount: number;
}
