import { StudentCareer } from '../../alumnos/interfaces/student-career.interface';

export type SelectedStudentFormData = {
  id: number;
  name: string;
  lastName: string;
  email: string;
  telephone: string;
  dni: string;
  address: string;
  observations: string;
  countryId?: number;
  careers: StudentCareer[];
};
