export interface UpdateStudentDto {
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
  careers: {
    careerId: number;
    name: string;
    year: string;
    active: boolean
  }[]
}
