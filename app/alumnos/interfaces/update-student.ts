import { StudentCareer } from "./student-career.interface";

export interface UpdateStudentDto {
  id?: number;
  name: string;
  lastName: string;
  dni: string;
  telephone: string;
  birthdate: Date;
  address: string;
  yearEntry: Date;
  observations: string;
  countryId: number;
  email: string;
  careers?: StudentCareer[];
}
