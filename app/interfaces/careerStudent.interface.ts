import { Student } from "../alumnos-asignados/page";
import { Career } from "./career.interface";


export interface CareerStudent {
    id: number;
    active: boolean;
    Career: Career;
    student: Student;
}