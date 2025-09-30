// interfaces/create.tutors.interface.ts
export interface Tutors {
  user: {
    id: number;
    name: string;
    lastName: string;
    email: string;
    telephone?: string | null;
  };
  sex?: string | null;
  department?: { id: number; name: string } | null;
  category?: string | null;
}
