import { Career } from "./career-interface";
import { User } from "./user.interface";

export interface Student {
    id: number;
    dni: string;
    telephone: string;
    birthdate: Date;
    address: string;
    yearEntry: Date;
    observations?: string;
    countryId: number;
    user: User;
    careers: Career[]
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }