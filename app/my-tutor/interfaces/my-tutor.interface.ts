export interface MyTutor {
  id: number;
  name: string;
  lastName: string;
  email: string;
  telephone?: string;
  department?: {
    id: number;
    name: string;
  };
}
