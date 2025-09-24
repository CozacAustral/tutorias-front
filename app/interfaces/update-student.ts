import { StudentCareer } from "../alumnos/interfaces/studentCareer.interface";

export interface UpdateStudentDto {
  name: string;
  lastName: string;
  dni: string;
  telephone: string;
  birthdate: Date;
  address: string;
  year: Date;
  observations: string;
  countryId: number;
  email: string;
  careers: StudentCareer[];
}
