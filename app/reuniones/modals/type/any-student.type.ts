export type AnyStudent = {
  id: number;
  careers?:
    | Array<{
        id?: number;
        name?: string;
        yearOfAdmission?: number;
        active?: boolean;
        careerId?: number;
        career?: { id?: number; name?: string };
      }>
    | undefined;
  assignedCareers?:
    | Array<{
        careerId?: number;
        yearOfAdmission?: number;
        active?: boolean;
        career?: { id?: number; name?: string };
      }>
    | undefined;
  studentCareers?:
    | Array<{
        careerId?: number;
        yearOfAdmission?: number;
        active?: boolean;
        career?: { id?: number; name?: string };
      }>
    | undefined;
};
