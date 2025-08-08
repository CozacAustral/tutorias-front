import { Student } from "./student.interface";

export interface ResponsePaginateStudent {
    students: Student[];
    totalCount: number;
}