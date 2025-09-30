import { Career } from "../../alumnos/interfaces/career.interface";
import { Student } from "../../alumnos/interfaces/student.interface";

export interface CareerStudent {
  id: number;
  active: boolean;
  Career: Career;
  student: Student;
}
