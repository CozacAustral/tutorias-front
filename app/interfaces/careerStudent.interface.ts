import { Student } from "../alumnos/interfaces/student.interface";
import { Career } from "./career.interface";

export interface CareerStudent {
  id: number;
  active: boolean;
  Career: Career;
  student: Student;
}
