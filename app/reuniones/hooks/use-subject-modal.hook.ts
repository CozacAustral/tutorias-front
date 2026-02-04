import { useCallback, useMemo, useState } from "react";
import { SubjectCareerWithState } from "../../alumnos/interfaces/subject-career-student.interface";
import { UserService } from '../../../services/admin-service';
import { subjectStateValueForSelect, subjectStateLabel } from '../utils/subjects.utils';


export function useSubjectsModal() {
  const [subjects, setSubjects] = useState<SubjectCareerWithState[]>([]);
  const [subjectsTitle, setSubjectsTitle] = useState<string | undefined>();
  const [editedSubjects, setEditedSubjects] = useState<Record<number, string>>(
    {},
  );
  const [currentSubjectsStudentId, setCurrentSubjectsStudentId] = useState<
    number | null
  >(null);
  const [currentSubjectsCareerId, setCurrentSubjectsCareerId] = useState<
    number | null
  >(null);
  const [savingSubjects, setSavingSubjects] = useState(false);

  const openSubjects = useCallback(
    async (args: {
      studentId: number | null;
      careerId: number | undefined;
      careerName: string | undefined;
    }) => {
      const { studentId, careerId, careerName } = args;
      if (!studentId || !careerId) return;
      try {
        const list =
          (await UserService.fetchStudentSubject(studentId, careerId)) ?? [];
        setSubjects(list);
        setSubjectsTitle(careerName);
        setEditedSubjects({});
        setCurrentSubjectsStudentId(studentId);
        setCurrentSubjectsCareerId(careerId);
      } catch {}
    },
    [],
  );

  const closeSubjects = useCallback(() => {
    setSubjects([]);
    setSubjectsTitle(undefined);
    setEditedSubjects({});
    setCurrentSubjectsStudentId(null);
    setCurrentSubjectsCareerId(null);
  }, []);

  const saveSubjects = useCallback(async () => {
    if (!currentSubjectsStudentId) return;
    const updates = Object.entries(editedSubjects);
    if (updates.length === 0) return;

    try {
      setSavingSubjects(true);

      await Promise.all(
        updates.map(([subjectIdStr, newState]) =>
          UserService.updateStateSubject(
            currentSubjectsStudentId,
            parseInt(subjectIdStr, 10),
            newState,
          ),
        ),
      );

      setSubjects((prev) =>
        prev.map((s) =>
          editedSubjects[s.subjectId]
            ? {
                ...s,
                subjectState: editedSubjects[s.subjectId],
                updateAt: new Date(),
              }
            : s,
        ),
      );

      setEditedSubjects({});
    } catch {
    } finally {
      setSavingSubjects(false);
    }
  }, [editedSubjects, currentSubjectsStudentId]);

  const renderSubjectRow = useMemo(() => {
    return (subject: SubjectCareerWithState) => {
      const selectValue =
        editedSubjects[subject.subjectId] !== undefined
          ? editedSubjects[subject.subjectId]
          : subjectStateValueForSelect(subject.subjectState);

      return {
        selectValue,
        label: subjectStateLabel(subject.subjectState),
      };
    };
  }, [editedSubjects]);

  return {
    subjects,
    subjectsTitle,
    editedSubjects,
    setEditedSubjects,
    currentSubjectsStudentId,
    currentSubjectsCareerId,
    savingSubjects,
    openSubjects,
    closeSubjects,
    saveSubjects,
    renderSubjectRow,
  };
}
