import { User } from "../../administradores/interfaces/user.interface";
import { StudentCareer } from "./studentCareer.interface";

export interface Student {
  id: number;
  dni: string;
  telephone: string;
  birthdate: Date;
  address: string;
  yearEntry: Date;
  observations?: string;
  careersId: number[];
  careers: StudentCareer[];
  countryId: number;
  user: User;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
