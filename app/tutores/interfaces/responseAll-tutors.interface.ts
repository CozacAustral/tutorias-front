export interface ResponseAllTutors {
  user: {
    id: number;
    email: string;
    name: string;
    lastName: string;
    telephone: string | null;
    departmentId: number | null;
    roleId: number;
    role: {
      id: number;
      name: string;
    };
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
