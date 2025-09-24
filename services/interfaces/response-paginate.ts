import { Student } from "../../app/alumnos/interfaces/student.interface";

export interface ResponsePaginateStudent {
  students: Student[];
  totalCount: number;
}
