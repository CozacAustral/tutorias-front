import { UserLabelInfo } from "../type/user-label.type";
import { studentlike } from "../type/student-like.type";

export function studentLabel(student: { id: number; user?: UserLabelInfo | null }) {
  const name = student.user?.name ?? "";
  const last = student.user?.lastName ?? "";
  const email = student.user?.email ?? "";
  const full = [name, last].filter(Boolean).join(" ");
  return full || email || `Alumno #${student.id}`;
}

export function extractStudentsFromResponse(response: unknown): studentlike[] {
  const typedResponse = response as {
    data?:
      | {
          data?: Array<{ id?: number; user?: studentlike["user"] }>;
          students?: Array<{ id?: number; user?: studentlike["user"] }>;
        }
      | Array<{ id?: number; user?: studentlike["user"] }>;
  };

  const rawList =
    (Array.isArray(typedResponse?.data) && typedResponse.data) ||
    typedResponse?.data?.data ||
    typedResponse?.data?.students ||
    [];

  return rawList.filter(
    (student): student is studentlike => typeof student.id === "number",
  );
}
