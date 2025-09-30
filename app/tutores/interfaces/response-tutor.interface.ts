export interface ResponseTutor {
  user: {
    id: number;
    email: string;
    name: string;
    lastName: string;
    telephone?: string;
    departmentId?: number;
    roleId: number;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
