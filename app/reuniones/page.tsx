"use client";

import { DeleteIcon, EditIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  HStack,
  IconButton,
  Select,
  Td,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FiFilePlus, FiFileText } from "react-icons/fi";
import GenericTable from "../../common/components/generic-table";
import { UserService } from "../../services/admin-service";
import { Country } from "../alumnos/interfaces/country.interface";
import { SubjectCareerWithState } from "../alumnos/interfaces/subject-career-student.interface";
import SubjectModal from "../alumnos/modals/subject-student.modal";
import StudentModal from "../alumnos/modals/view-student.modal";
import { useSidebar } from "../contexts/SidebarContext";
import ConfirmDialog from "./modals/confirm-dialog-modal";
import CreateReportModal from "./modals/create-report-modal";
import EditMeetingModal from "./modals/edit-meeting-modal";
import FilterMeetingsModal from "./modals/filtro-busqueda-modal";
import ScheduleMeetingModal from "./modals/schedule-meetings-modals";
import ViewReportModal from "./modals/view-report-modal";
import { Filters } from "./type/filters.type";
import { GetMeetingsResp } from "./type/get-meeting-response.type";
import { MeetingRow } from "./type/meeting-row.type";
import { MeetingStatus } from "./type/meetings-status.type";
import { Row } from "./type/rows.type";
import { SelectedStudentFormData } from "./type/selected-student-form-data.type";
import { studentlike } from "./type/student-like.type";
import { StudentOption } from "./type/student-option.type";
import { UserLabelInfo } from "./type/user-label.type";

function studentLabel(student: { id: number; user?: UserLabelInfo | null }) {
  const name = student.user?.name ?? "";
  const last = student.user?.lastName ?? "";
  const email = student.user?.email ?? "";
  const full = [name, last].filter(Boolean).join(" ");

  return full || email || `Alumno #${student.id}`;
}

function extractStudentsFromResponse(response: unknown): studentlike[] {
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

function fullName(
  user?: { name?: string; lastName?: string; email?: string } | null,
) {
  if (!user) return "-";
  return (
    [user.name, user.lastName].filter(Boolean).join(" ") || user.email || "-"
  );
}

function pad2(name: number) {
  return String(name).padStart(2, "0");
}

function formatFecha(dateISO: string) {
  try {
    const date = new Date(dateISO);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateISO;
  }
}

function formatHora(dateISO: string, time?: string) {
  try {
    if (time && /^\d{1,2}:\d{2}/.test(time)) return time;
    const date = new Date(dateISO);
    return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
  } catch {
    return time ?? "";
  }
}

function statusBadge(status: MeetingStatus) {
  const label =
    status === "COMPLETED"
      ? "Completada"
      : status === "PENDING"
        ? "Pendiente"
        : status === "REPORTMISSING"
          ? "Falta reporte"
          : "—";

  switch (status) {
    case "COMPLETED":
      return (
        <Badge colorScheme="green" textTransform="none">
          {label}
        </Badge>
      );
    case "PENDING":
      return (
        <Badge colorScheme="gray" textTransform="none">
          {label}
        </Badge>
      );
    case "REPORTMISSING":
      return (
        <Badge colorScheme="yellow" textTransform="none">
          {label}
        </Badge>
      );
    default:
      return <Badge textTransform="none">—</Badge>;
  }
}

function toMeetingRow(row: Row): MeetingRow {
  return {
    ...row,
    fechaHora: row.fechaHora ?? `${row.fecha} ${row.hora}`,
    status: row.status === "COMPLETED",
  } as MeetingRow;
}

const Reuniones: React.FC = () => {
  const [reportStudentId, setReportStudentId] = useState<number | null>(null);

  const initialRef = useRef<HTMLInputElement | null>(null);
  const { collapsed } = useSidebar();
  const [myTutorId, setMyTutorId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(7);

  const searchParams = useSearchParams();
  const router = useRouter();

  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState<MeUser | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

  const [viewMeetingId, setViewMeetingId] = useState<number | null>(null);
  const [viewStudentId, setViewStudentId] = useState<number | null>(null);

  const [meetingToEdit, setMeetingToEdit] = useState<MeetingRow | null>(null);

  const {
    isOpen: isFilterOpen,
    onOpen: onFilterOpen,
    onClose: onFilterClose,
  } = useDisclosure();

  const [filters, setFilters] = useState<Filters>({
    status: "all",
    order: "desc",
  });
  const [studentsOptions, setStudentsOptions] = useState<StudentOption[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const {
    isOpen: isReportOpen,
    onOpen: onReportOpen,
    onClose: onReportClose,
  } = useDisclosure();
  const [reportMeetingId, setReportMeetingId] = useState<number | null>(null);

  const {
    isOpen: isSubjectsOpen,
    onOpen: onSubjectsOpen,
    onClose: onSubjectsClose,
  } = useDisclosure();

  const [subjects, setSubjects] = useState<SubjectCareerWithState[]>([]);
  const [subjectsTitle, setSubjectsTitle] = useState<string | undefined>();
  const [subjectsState] = useState<boolean | null>(null);
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

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);
  const cancelDeleteRef = useRef<HTMLButtonElement | null>(null);
  const [selectedStudent, setSelectedStudent] =
    useState<SelectedStudentFormData | null>(null);
  const {
    isOpen: isStudentOpen,
    onOpen: onStudentOpen,
    onClose: onStudentClose,
  } = useDisclosure();
  const [countries, setCountries] = useState<Country[]>([]);

  const isAdmin = useMemo(() => {
    if (!me?.role) return false;

    if (typeof me.role === "string") {
      return me.role.toUpperCase() === "ADMIN";
    }

    if (typeof me.role === "number") {
      return me.role === 1;
    }

    if (typeof me.role === "object") {
      return me.role.name === "ADMIN";
    }

    return false;
  }, [me]);

  const isTutor = useMemo(() => {
    if (!me?.role) return false;

    if (typeof me.role === "string") {
      return me.role.toUpperCase() === "TUTOR";
    }

    if (typeof me.role === "number") {
      return me.role === 2;
    }

    if (typeof me.role === "object") {
      return me.role.name === "TUTOR";
    }

    return false;
  }, [me]);

  const normalizedRole = useMemo(() => {
    if (!me?.role) return 0;

    if (typeof me.role === "number") return me.role;
    if (typeof me.role === "string") {
      if (me.role.toUpperCase() === "ADMIN") return 1;
      if (me.role.toUpperCase() === "TUTOR") return 2;
    }
    if (typeof me.role === "object") return me.role.id;

    return 0;
  }, [me]);

  useEffect(() => {
    const init = async () => {
      const user = await UserService.fetchMe();

      if (!user) {
        router.replace("/login");
        return;
      }

      setMe(user);
      setLoading(false);
    };

    init();
  }, []);
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const res = await UserService.fetchAllCountries();
        setCountries(res);
      } catch {
        setCountries([]);
      }
    };

    loadCountries();
  }, []);
  const SUBJECT_STATE_LABELS: Record<string, string> = {
    APPROVED: "Aprobada",
    REGULARIZED: "Regularizada",
    FREE: "Libre",
    INPROGRESS: "En curso",
    NOTATTENDED: "No cursada",
    RETAKING: "Recursando",
  };
  const loadStudentById = async (id: number) => {
    try {
      const studentFetched = await UserService.getOneStudentByRole(id);
      setSelectedStudent({
        id: studentFetched.id,
        name: studentFetched.user?.name ?? "",
        lastName: studentFetched.user?.lastName ?? "",
        email: studentFetched.user?.email ?? "",
        telephone: studentFetched.telephone ?? "",
        dni: studentFetched.dni ?? "",
        address: studentFetched.address ?? "",
        observations: studentFetched.observations ?? "",
        countryId: studentFetched.countryId,
        careers: studentFetched.careers ?? [],
      });
      return studentFetched;
    } catch {
      return null;
    }
  };

  const actionBtnProps = {
    backgroundColor: "white",
    _hover: {
      borderRadius: 15,
      backgroundColor: "#318AE4",
      color: "White",
    },
  } as const;

  const dangerBtnProps = {
    backgroundColor: "white",
    _hover: {
      borderRadius: 15,
      backgroundColor: "#E53E3E",
      color: "White",
    },
  } as const;

  function normalizeSubjectStateKey(subjectState: unknown) {
    return String(subjectState ?? "")
      .trim()
      .toUpperCase()
      .replace(/[\s_]/g, "");
  }

  function subjectStateLabel(subjectState: unknown) {
    const subjectlabels = normalizeSubjectStateKey(subjectState);
    return SUBJECT_STATE_LABELS[subjectlabels] ?? String(subjectState ?? "—");
  }

  function subjectStateValueForSelect(subjectState: unknown) {
    const subjectlabels = normalizeSubjectStateKey(subjectState);
    if (subjectlabels in SUBJECT_STATE_LABELS) return subjectlabels;
    return String(subjectState ?? "")
      .trim()
      .toUpperCase();
  }

  const headers = useMemo(() => {
    if (isTutor)
      return ["Alumno", "Fecha", "Hora", "Aula", "Status", "Acciones"];

    if (isAdmin) return ["Alumno", "Fecha", "Hora", "Aula", "Status"];

    return ["Fecha", "Hora", "Aula", "Status"];
  }, [isTutor, isAdmin]);

  const requestDelete = useCallback((row: Row) => {
    setRowToDelete(row);
    setIsDeleteOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!rowToDelete) return;
    try {
      setDeleting(true);
      await UserService.deleteMeeting(rowToDelete.id);
      setIsDeleteOpen(false);
      setRowToDelete(null);
      loadMeetings(page);
    } catch {
    } finally {
      setDeleting(false);
    }
  }, [rowToDelete, page]);

  const handleEdit = useCallback(
    (row: Row) => {
      setMeetingToEdit(toMeetingRow(row));
      onEditOpen();
    },
    [onEditOpen],
  );

  const renderRow = useCallback(
    (row: Row) => (
      <Tr key={row.id}>
        {(isTutor || isAdmin) && (
          <Td
            cursor={isTutor ? "pointer" : "default"}
            color={isTutor ? "blue.500" : "inherit"}
            fontWeight={isTutor ? "medium" : "normal"}
            _hover={isTutor ? { textDecoration: "underline" } : undefined}
            onClick={async () => {
              if (!isTutor || !row.studentId) return;
              const data = await loadStudentById(row.studentId);
              if (data) onStudentOpen();
            }}
          >
            {row.alumno}
          </Td>
        )}

        <Td>{row.fecha}</Td>
        <Td>{row.hora}</Td>
        <Td>{row.aula}</Td>
        <Td>{statusBadge(row.status)}</Td>

        {isTutor && (
          <Td>
            <HStack spacing={2}>
              {row.status !== "COMPLETED" && (
                <>
                  <IconButton
                    aria-label="Editar reunión"
                    icon={<EditIcon boxSize={5} />}
                    backgroundColor="white"
                    _hover={{
                      borderRadius: 15,
                      backgroundColor: "#318AE4",
                      color: "white",
                    }}
                    onClick={() => handleEdit(row)}
                  />

                  <IconButton
                    aria-label="Eliminar reunión"
                    icon={<DeleteIcon boxSize={5} />}
                    backgroundColor="white"
                    _hover={{
                      borderRadius: 15,
                      backgroundColor: "red.500",
                      color: "white",
                    }}
                    onClick={() => requestDelete(row)}
                  />
                </>
              )}

              {row.status !== "PENDING" &&
                (row.status === "REPORTMISSING" ? (
                  <IconButton
                    aria-label="Crear reporte"
                    icon={<FiFilePlus />}
                    backgroundColor="white"
                    _hover={{
                      borderRadius: 15,
                      backgroundColor: "#318AE4",
                      color: "white",
                    }}
                    onClick={() => {
                      setReportMeetingId(row.id);
                      setReportStudentId(row.studentId ?? null);
                      onReportOpen();
                    }}
                  />
                ) : (
                  <IconButton
                    aria-label="Ver reporte"
                    icon={<FiFileText />}
                    backgroundColor="white"
                    _hover={{
                      borderRadius: 15,
                      backgroundColor: "#318AE4",
                      color: "white",
                    }}
                    onClick={() => {
                      setViewMeetingId(row.id);
                      setViewStudentId(row.studentId ?? null);
                      onViewOpen();
                    }}
                  />
                ))}
            </HStack>
          </Td>
        )}
      </Tr>
    ),
    [isTutor, isAdmin, handleEdit, requestDelete, onReportOpen, onViewOpen],
  );
  async function loadMeetings(pages = page) {
    setLoading(true);
    try {
      const meetingsRes = await UserService.getMeetings(pages, limit, {
        ...filters,
      });
      let foundTutorId: number | null = null;

      const mapped: Row[] = (meetingsRes.data ?? []).map(
        (meeting: GetMeetingsResp["data"][number]) => {
          const student = meeting?.tutorship?.student ?? null;
          const alumno = fullName(student?.user ?? null);

          const fecha = formatFecha(meeting.date);
          const hora = formatHora(meeting.date);

          const row: Row = {
            id: meeting.id,
            tutor: "—",
            alumno,
            fecha,
            hora,
            fechaHora: `${fecha} ${hora}`,
            aula: meeting.location,
            status: meeting.computedStatus ?? meeting.status,
            studentId:
              student?.id ?? meeting?.tutorship?.studentId ?? undefined,
            tutorId: meeting?.tutorship?.tutorId ?? undefined,
          };
          if (!foundTutorId && row.tutorId) foundTutorId = row.tutorId;
          return row;
        },
      );

      if (foundTutorId) setMyTutorId(foundTutorId);

      setRows(mapped);
      setTotal(meetingsRes.total ?? mapped.length);
    } catch {
      setRows([]);
      setTotal(0);
      setStudentsOptions([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMeetings(page);
  }, [page, JSON.stringify(filters)]);

  const openCreate = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("openCreate", "1");
    router.replace(`/reuniones?${params.toString()}`, { scroll: false });
    onOpen();
    setTimeout(() => initialRef.current?.focus(), 0);
  }, [router, searchParams, onOpen]);

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
            {
              currentPage: 1,
              resultsPerPage: 7,
            },
          );

          studentsList = studentsByTutorResponse?.data ?? [];
        }

        const studentOptions: StudentOption[] = studentsList
          .map((student: studentlike) => ({
            id: student.id,
            label: studentLabel(student),
          }))
          .filter(
            (option): option is StudentOption =>
              Boolean(option.id) && option.label.length > 0,
          )
          .reduce<StudentOption[]>((uniqueOptions, currentOption) => {
            const alreadyExists = uniqueOptions.some(
              (existingOption) => existingOption.id === currentOption.id,
            );

            if (!alreadyExists) uniqueOptions.push(currentOption);
            return uniqueOptions;
          }, [])
          .sort((left, right) => left.label.localeCompare(right.label, "es"));

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

  const loadStudentsForFilter = async (
    search: string,
  ): Promise<StudentOption[]> => {
    if (!me) return [];

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
  };
  const handleOpenSubjects = useCallback(
    async ({
      studentId,
      careerId,
      careerName,
    }: {
      studentId: number | null;
      careerId: number | undefined;
      careerName: string | undefined;
    }) => {
      if (!studentId || !careerId) return;
      try {
        const list =
          (await UserService.fetchStudentSubject(studentId, careerId)) ?? [];
        setSubjects(list);
        setSubjectsTitle(careerName);
        setEditedSubjects({});
        setCurrentSubjectsStudentId(studentId);
        setCurrentSubjectsCareerId(careerId);
        onSubjectsOpen();
      } catch {}
    },
    [onSubjectsOpen],
  );

  const handleSaveSubjects = useCallback(async () => {
    if (!currentSubjectsStudentId) {
      onSubjectsClose();
      return;
    }
    const updates = Object.entries(editedSubjects);
    if (updates.length === 0) {
      onSubjectsClose();
      return;
    }
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
        prev.map((student) =>
          editedSubjects[student.subjectId]
            ? {
                ...student,
                subjectState: editedSubjects[student.subjectId],
                updateAt: new Date(),
              }
            : student,
        ),
      );

      setEditedSubjects({});
      onSubjectsClose();
    } catch {
    } finally {
      setSavingSubjects(false);
    }
  }, [editedSubjects, currentSubjectsStudentId, onSubjectsClose]);

  const renderSubjectNow = useCallback(
    (subject: SubjectCareerWithState) => {
      const selectValue =
        editedSubjects[subject.subjectId] !== undefined
          ? editedSubjects[subject.subjectId]
          : subjectStateValueForSelect(subject.subjectState);

      return (
        <Tr key={subject.subjectId}>
          <Td>{subject.subjectName}</Td>
          <Td>{subject.year}</Td>

          <Td>
            {editedSubjects[subject.subjectId] !== undefined ? (
              <Select
                value={selectValue}
                onChange={(subjectedited) =>
                  setEditedSubjects((prev) => ({
                    ...prev,
                    [subject.subjectId]: subjectedited.target.value,
                  }))
                }
              >
                <option value="APPROVED">Aprobada</option>
                <option value="REGULARIZED">Regularizada</option>
                <option value="FREE">Libre</option>
                <option value="INPROGRESS">En curso</option>
                <option value="NOTATTENDED">No cursada</option>
                <option value="RETAKING">Recursando</option>
              </Select>
            ) : (
              subjectStateLabel(subject.subjectState)
            )}
          </Td>

          <Td>
            {subject.updateAt
              ? new Date(subject.updateAt).toLocaleDateString("es-AR")
              : "-"}
          </Td>

          <Td>
            <IconButton
              icon={<EditIcon boxSize={5} />}
              aria-label="Editar"
              backgroundColor={
                editedSubjects[subject.subjectId] !== undefined
                  ? "#318AE4"
                  : "white"
              }
              _hover={{
                borderRadius: 15,
                backgroundColor: "#318AE4",
                color: "white",
              }}
              onClick={() =>
                setEditedSubjects((prev) => ({
                  ...prev,
                  [subject.subjectId]: subjectStateValueForSelect(
                    subject.subjectState,
                  ),
                }))
              }
            />
          </Td>
        </Tr>
      );
    },
    [editedSubjects],
  );
  console.log("ROLE:", me?.role, "isTutor:", isTutor);

  return (
    <>
      <Box pl={collapsed ? "6.5rem" : "17rem"} px={5}>
        <GenericTable<Row>
          showAddMenu={false}
          caption="Reuniones"
          data={rows}
          TableHeader={headers}
          renderRow={renderRow}
          currentPage={page}
          totalItems={total}
          itemsPerPage={limit}
          onPageChange={setPage}
          filter={false}
          actions={false}
          hasSidebar
          topRightComponent={
            <HStack>
              <Button
                leftIcon={<SearchIcon />}
                variant="outline"
                onClick={onFilterOpen}
              >
                Filtros
              </Button>
              {isTutor && (
                <Button onClick={openCreate} isLoading={loading}>
                  + Agendar
                </Button>
              )}
            </HStack>
          }
          minH="500px"
        />
      </Box>

      <ScheduleMeetingModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          const params = new URLSearchParams(searchParams.toString());
          params.delete("openCreate");
          router.replace(`/reuniones?${params.toString()}`, { scroll: false });
        }}
        students={studentsOptions}
        onCreated={() => loadMeetings(page)}
      />

      <EditMeetingModal
        isOpen={isEditOpen}
        onClose={() => {
          onEditClose();
          setMeetingToEdit(null);
        }}
        meeting={meetingToEdit}
        onUpdated={() => loadMeetings(page)}
      />

      <FilterMeetingsModal
        isOpen={isFilterOpen}
        onClose={onFilterClose}
        students={studentsOptions}
        loadStudents={loadStudentsForFilter}
        current={filters}
        onApply={(f) => {
          setFilters(f);
          setPage(1);
        }}
        onClear={() => {
          setFilters({ status: "all", order: "desc" });
          setPage(1);
        }}
      />

      <CreateReportModal
        isOpen={isReportOpen}
        onClose={() => {
          onReportClose();
          setReportMeetingId(null);
          setReportStudentId(null);
          setFilters((prevpage) => ({ ...prevpage, studentId: undefined }));
          const params = new URLSearchParams(searchParams.toString());
          params.delete("createReportFor");
          params.delete("studentId");
          router.replace(`/reuniones?${params.toString()}`, { scroll: false });
        }}
        meetingId={reportMeetingId}
        studentId={reportStudentId}
        onCreated={() => {
          onReportClose();
          setReportMeetingId(null);
          setReportStudentId(null);
          setFilters((prevpage) => ({ ...prevpage, studentId: undefined }));
          const params = new URLSearchParams(searchParams.toString());
          params.delete("createReportFor");
          params.delete("studentId");
          router.replace(`/reuniones?${params.toString()}`, { scroll: false });
          loadMeetings(page);
        }}
      />

      <ViewReportModal
        isOpen={isViewOpen}
        onClose={() => {
          onViewClose();
          setViewMeetingId(null);
          setViewStudentId(null);
          const params = new URLSearchParams(searchParams.toString());
          params.delete("viewReportFor");
          router.replace(`/reuniones?${params.toString()}`, { scroll: false });
        }}
        meetingId={viewMeetingId}
        studentId={viewStudentId}
        onDeleted={() => {
          loadMeetings(page);
        }}
        onOpenSubjects={handleOpenSubjects}
      />

      <SubjectModal
        isOpen={isSubjectsOpen}
        onClose={() => {
          onSubjectsClose();
          setSubjects([]);
          setSubjectsTitle(undefined);
          setEditedSubjects({});
        }}
        onConfirm={handleSaveSubjects}
        entityName="Materias"
        titleCareer={subjectsTitle}
        subjects={subjects}
        renderSubjectNow={renderSubjectNow}
        state={subjectsState}
        role={3}
        showButtonCancelSave={!savingSubjects}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setRowToDelete(null);
        }}
        onConfirm={confirmDelete}
        isLoading={deleting}
        leastDestructiveRef={cancelDeleteRef}
        title="Eliminar reunión"
        body={
          <>
            ¿Eliminar la reunión con <b>{rowToDelete?.alumno ?? "—"}</b> del{" "}
            <b>
              {rowToDelete?.fecha ?? "—"} {rowToDelete?.hora ?? ""}
            </b>
            ? Esta acción no se puede deshacer.
          </>
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmColorScheme="red"
      />
      {selectedStudent && (
        <StudentModal
          isOpen={isStudentOpen}
          onClose={() => {
            onStudentClose();
            setSelectedStudent(null);
          }}
          isViewMode={true}
          role={normalizedRole}
          formData={selectedStudent}
          countries={countries}
          renderSubjectNowView={(student, i) => (
            <Tr key={student.subjectId ?? i}>
              <Td>{student.subjectName}</Td>
              <Td>{student.year}</Td>
              <Td>{student.subjectState}</Td>
              <Td>
                {student.updateAt
                  ? new Date(student.updateAt).toLocaleDateString("es-AR")
                  : "-"}
              </Td>
            </Tr>
          )}
        />
      )}
    </>
  );
};

export default Reuniones;
