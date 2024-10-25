import { User } from "./user.interface";

export interface Tutors {
    id: number;
    dni: string;
    birthdate: Date;
    sex: string;
    yearEntry: Date;
    category: string;
    dedication: string;
    dedicationDays: number;
    user: User;
    userId: number;
    countryId: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }
  