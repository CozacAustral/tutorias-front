export interface StudentAdmin {
  id: number;
  dni: string;
  telephone: string;
  birthdate: string | Date;
  address: string;
  yearEntry: string | Date;
  countryId: number;
  createdAt: string | Date;
  updatedAt?: string | Date;
  deletedAt?: string | Date;

  user: {
    id: number;
    email: string;
    name: string;
    lastName: string;
    departmentId?: number;
    roleId: number;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    deletedAt?: string | Date;
  };

  careers?: { id: number; name: string; yearOfThePlan: number }[];
}
