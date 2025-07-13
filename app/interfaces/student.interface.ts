import { Career } from "./career.interface";
import { CareerStudent } from "./careerStudent.interface";
import { User } from "./user.interface";

export interface Student {
  id: number;
  dni: string;
  telephone: string;
  birthdate: Date;
  address: string;
  yearEntry: Date;
  observations?: string;
  careersId: number[];
  careers: {
    careerId: number;
    name: string;
    year: string;
    active: boolean
  }[]
  countryId: number;
  user: User;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}