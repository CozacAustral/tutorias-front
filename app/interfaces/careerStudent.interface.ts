
import { Career } from "./career.interface";
import { Student } from "./student.interface";


export interface CareerStudent {
    id: number;
    active: boolean;
    Career: Career;
    student: Student;
}