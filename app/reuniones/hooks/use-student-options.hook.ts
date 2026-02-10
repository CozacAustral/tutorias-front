import { useCallback, useEffect, useState } from "react";
import { StudentOption } from "../type/student-option.type";
import { studentlike } from "../type/student-like.type";
import { UserService } from "../../../services/admin-service";
import {
  extractStudentsFromResponse,
  studentLabel,
} from "../utils/students.utils";

export function useStudentOptions(params: {
  isTutor: boolean;
  isAdmin: boolean;
  meExists: boolean;
  myTutorId: number | null;
}) {
  const { isTutor, isAdmin, meExists, myTutorId } = params;

  const [studentsOptions, setStudentsOptions] = useState<StudentOption[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const loadStudentsForTutor = useCallback(
    async (tutorId?: number | null) => {
      if (!isTutor) {
        setStudentsOptions([]);
        return;
      }

      setLoadingStudents(true);

      try {
        const myStudentsResponse = await UserService.getMyStudents(1, 500);
        let studentsList: studentlike[] =
          extractStudentsFromResponse(myStudentsResponse);

        if (studentsList.length === 0 && tutorId) {
          const studentsByTutorResponse = await UserService.getStudentsByTutor(
            tutorId,
            { currentPage: 1, resultsPerPage: 7 },
          );
          studentsList = studentsByTutorResponse?.data ?? [];
        }

        const seenIds = new Set<number>();
        const studentOptions: StudentOption[] = [];

        for (const student of studentsList) {
          const id = student?.id;

          if (!id) continue;
          if (seenIds.has(id)) continue;

          const label = studentLabel(student);
          if (!label || label.length === 0) continue;

          seenIds.add(id);
          studentOptions.push({ id, label });
        }

        studentOptions.sort((left, right) =>
          left.label.localeCompare(right.label, "es"),
        );

        setStudentsOptions(studentOptions);
      } catch {
        setStudentsOptions([]);
      } finally {
        setLoadingStudents(false);
      }
    },
    [isTutor],
  );

  useEffect(() => {
    if (!isTutor) return;
    loadStudentsForTutor(null);
  }, [isTutor, loadStudentsForTutor]);

  useEffect(() => {
    if (!isTutor || !myTutorId) return;
    loadStudentsForTutor(myTutorId);
  }, [isTutor, myTutorId, loadStudentsForTutor]);

  const loadStudentsForFilter = useCallback(
    async (search: string): Promise<StudentOption[]> => {
      if (!meExists) return [];

      if (isAdmin) {
        const response = await UserService.fetchAllStudents({
          search,
          currentPage: 1,
          resultsPerPage: 20,
        });

        return response.students.map((student) => ({
          id: student.id,
          label: studentLabel(student),
        }));
      }

      const myStudentsResponse = await UserService.getMyStudents(1, 20, search);
      const studentsList = extractStudentsFromResponse(myStudentsResponse);

      return studentsList.map((student) => ({
        id: student.id,
        label: studentLabel(student),
      }));
    },
    [isAdmin, meExists],
  );

  return {
    studentsOptions,
    setStudentsOptions,
    loadingStudents,
    loadStudentsForTutor,
    loadStudentsForFilter,
  };
}
