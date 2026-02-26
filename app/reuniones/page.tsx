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
import { StudentCareer } from "../alumnos/interfaces/student-career.interface";
import { Student } from "../alumnos/interfaces/student.interface";
import { SubjectCareerWithState } from "../alumnos/interfaces/subject-career-student.interface";
import SubjectModal from "../alumnos/modals/subject-student.modal";
import StudentModal from "../alumnos/modals/view-student.modal";
import { useSidebar } from "../contexts/SidebarContext";
import { ResponseAllTutors } from "../tutores/interfaces/responseAll-tutors.interface";
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
import { OptionItem } from "./type/student-option.type";

type UserBasic = { name?: string; lastName?: string; email?: string };

type StudentLike = {
  id?: number;
  user?: UserBasic | null;
};

type MeRole =
  | number
  | string
  | {
      id?: number;
      name?: string;
    };

type MeUser = {
  role?: MeRole;
};

type SelectedStudentFormData = {
  id: number;
  name: string;
  lastName: string;
  email: string;
  telephone: string;
  dni: string;
  address: string;
  observations: string;
  countryId?: number;
  careers: StudentCareer[];
};

type GenericListResponse = { data?: unknown };
type FetchAllStudentsResp = { students: StudentLike[] };
type GetMyStudentsResp = {
  data?: { data?: StudentLike[]; students?: StudentLike[] } | StudentLike[];
};
type StudentsByTutorResp = { data?: StudentLike[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asStudentList(value: unknown): StudentLike[] {
  if (Array.isArray(value)) return value as StudentLike[];
  return [];
}

function studentLabel(student?: StudentLike | null) {
  const name = student?.user?.name ?? "";
  const last = student?.user?.lastName ?? "";
  const email = student?.user?.email ?? "";
  const full = [name, last].filter(Boolean).join(" ");
  return full || email || `Alumno #${student?.id ?? "-"}`;
}

function fullName(user?: UserBasic | null) {
  if (!user) return "-";
  return (
    [user.name, user.lastName].filter(Boolean).join(" ") || user.email || "-"
  );
}

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

function formatFecha(dateISO: string) {
  try {
    const dateValue = new Date(dateISO);
    return dateValue.toLocaleDateString("es-AR", {
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
  };
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

  const [studentsOptions, setStudentsOptions] = useState<OptionItem[]>([]);

  const [tutorsOptions, setTutorsOptions] = useState<OptionItem[]>([]);

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

  const toTutorOption = (t: ResponseAllTutors): OptionItem => ({
    id: t.user.id,
    label: `${t.user.name} ${t.user.lastName}`.trim(),
  });

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
    if (typeof me.role === "object") return me.role.id ?? 0;

    return 0;
  }, [me]);

  useEffect(() => {
    const init = async () => {
      const user = (await UserService.fetchMe()) as unknown;

      if (!user) {
        router.replace("/login");
        return;
      }

      setMe(user as MeUser);
      setLoading(false);
    };

    init();
  }, [router]);

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
      const studentFetched = (await UserService.getOneStudentByRole(
        id,
      )) as Student;

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
        careers: (studentFetched.careers ?? []) as StudentCareer[],
      });

      return studentFetched;
    } catch {
      return null;
    }
  };

  function normalizeSubjectStateKey(value: unknown) {
    return String(value ?? "")
      .trim()
      .toUpperCase()
      .replace(/[\s_]/g, "");
  }

  function subjectStateLabel(value: unknown) {
    const subject = normalizeSubjectStateKey(value);
    return SUBJECT_STATE_LABELS[subject] ?? String(value ?? "—");
  }

  function subjectStateValueForSelect(value: unknown) {
    const subject = normalizeSubjectStateKey(value);
    if (subject in SUBJECT_STATE_LABELS) return subject;
    return String(value ?? "")
      .trim()
      .toUpperCase();
  }

  const headers = useMemo(
    () =>
      isTutor
        ? ["Alumno", "Fecha", "Hora", "Aula", "Status", "Acciones"]
        : ["Alumno", "Fecha", "Hora", "Aula", "Status"],
    [isTutor],
  );

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
        <Td
          cursor="pointer"
          color="blue.500"
          fontWeight="medium"
          _hover={{ textDecoration: "underline" }}
          onClick={async () => {
            if (!row.studentId) return;
            const data = await loadStudentById(row.studentId);
            if (data) onStudentOpen();
          }}
        >
          {row.alumno}
        </Td>
        <Td>{row.fecha}</Td>
        <Td>{row.hora}</Td>
        <Td>{row.aula}</Td>
        <Td>{statusBadge(row.status)}</Td>

        {isTutor && (
          <Td>
            <HStack spacing={2}>
              {row.status !== "COMPLETED" && (
                <IconButton
                  aria-label="Editar reunión"
                  icon={<EditIcon boxSize={5} />}
                  backgroundColor="white"
                  onClick={() => handleEdit(row)}
                  _hover={{
                    borderRadius: 15,
                    backgroundColor: "#318AE4",
                    color: "white",
                  }}
                />
              )}

              {row.status !== "COMPLETED" && (
                <IconButton
                  aria-label="Eliminar reunión"
                  icon={<DeleteIcon boxSize={5} />}
                  backgroundColor="white"
                  onClick={() => requestDelete(row)}
                  _hover={{
                    borderRadius: 15,
                    backgroundColor: "red.500",
                    color: "white",
                  }}
                />
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
                      const params = new URLSearchParams(
                        searchParams.toString(),
                      );
                      params.set("createReportFor", String(row.id));
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
                      const params = new URLSearchParams(
                        searchParams.toString(),
                      );
                      params.set("viewReportFor", String(row.id));
                      router.replace(`/reuniones?${params.toString()}`, {
                        scroll: false,
                      });
                      onViewOpen();
                    }}
                  />
                ))}
            </HStack>
          </Td>
        )}
      </Tr>
    ),
    [
      handleEdit,
      requestDelete,
      searchParams,
      router,
      onReportOpen,
      onViewOpen,
      isTutor,
      onStudentOpen,
    ],
  );

  async function loadMeetings(PaginateStudent = page) {
    setLoading(true);
    try {
      const meetingsRes = (await UserService.getMeetings(
        PaginateStudent,
        limit,
        {
          ...filters,
        },
      )) as GetMeetingsResp;

      let foundTutorId: number | null = null;

      let mappedRows: Row[] = (meetingsRes.data ?? []).map(
        (meetingItem: GetMeetingsResp["data"][number]) => {
          const student = meetingItem?.tutorship?.student ?? null;
          const alumno = fullName(student?.user ?? null);
          const tutorName = meetingItem?.tutorship?.tutor?.user
            ? fullName(meetingItem.tutorship.tutor.user)
            : "";

          const fecha = formatFecha(meetingItem.date);
          const hora = formatHora(meetingItem.date);

          const row: Row = {
            id: meetingItem.id,
            tutor: tutorName || "—",
            alumno,
            fecha,
            hora,
            fechaHora: `${fecha} ${hora}`,
            aula: meetingItem.location,
            status: meetingItem.computedStatus ?? meetingItem.status,
            studentId:
              student?.id ?? meetingItem?.tutorship?.studentId ?? undefined,
            tutorId: meetingItem?.tutorship?.tutorId ?? undefined,
          };

          if (!foundTutorId && row.tutorId) foundTutorId = row.tutorId;
          return row;
        },
      );

      if (foundTutorId) setMyTutorId(foundTutorId);

      if (filters.tutorId !== undefined && filters.tutorId !== null) {
        mappedRows = mappedRows.filter((r) => r.tutorId === filters.tutorId);
      }

      setRows(mappedRows);
      setTotal(meetingsRes.total ?? mappedRows.length);
    } catch {
      setRows([]);
      setTotal(0);
      setStudentsOptions([]);
    } finally {
      setLoading(false);
    }
  }

  const tutorsCacheRef = useRef<OptionItem[] | null>(null);

  const loadTutorsForFilter = useCallback(
    async (search: string): Promise<OptionItem[]> => {
      const q = (search ?? "").trim().toLowerCase();

      try {
        let list: OptionItem[];

        if (tutorsCacheRef.current && q === "") {
          list = tutorsCacheRef.current;
        } else {
          const tutorsRes = await UserService.getAllTutors();
          list = tutorsRes.map(toTutorOption);
          tutorsCacheRef.current = list;
        }

        const options = list
          .filter((o) => o.label.toLowerCase().includes(q))
          .sort((a, b) => a.label.localeCompare(b.label, "es"));

        setTutorsOptions(options);
        return options;
      } catch (e) {
        console.error(e);
        setTutorsOptions([]);
        return [];
      }
    },
    [],
  );

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
        const meRes = (await UserService.getMyStudents(1, 500)) as unknown;

        let list: StudentLike[] = [];

        // meRes?.data?.data / meRes?.data?.students / meRes?.data
        if (isRecord(meRes)) {
          const data = meRes["data"];
          if (Array.isArray(data)) {
            list = asStudentList(data);
          } else if (isRecord(data)) {
            const dataData = data["data"];
            const dataStudents = data["students"];
            if (Array.isArray(dataData)) list = asStudentList(dataData);
            else if (Array.isArray(dataStudents))
              list = asStudentList(dataStudents);
          }
        }

        if ((!list || list.length === 0) && tutorId) {
          const byId = (await UserService.getStudentsByTutor(tutorId, {
            currentPage: 1,
            resultsPerPage: 7,
          })) as unknown;

          if (isRecord(byId)) {
            const data = byId["data"];
            list = asStudentList(data);
          }
        }

        const opts = (list ?? [])
          .map((student) => ({
            id: student.id ?? 0,
            label: studentLabel(student),
          }))
          .filter((student) => student.id && student.label)
          .reduce((uniqueOptions: OptionItem[], optionItem: OptionItem) => {
            const alreadyExists = uniqueOptions.some(
              (existingOption) => existingOption.id === optionItem.id,
            );
            if (!alreadyExists) uniqueOptions.push(optionItem);
            return uniqueOptions;
          }, [])
          .sort((leftOption, rightOption) =>
            leftOption.label.localeCompare(rightOption.label, "es"),
          );

        setStudentsOptions(opts);
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
  ): Promise<OptionItem[]> => {
    if (!me) return [];

    if (isAdmin) {
      const res = (await UserService.fetchAllStudents({
        search,
        currentPage: 1,
        resultsPerPage: 20,
      })) as FetchAllStudentsResp;

      return (res.students ?? []).map((student) => ({
        id: student.id ?? 0,
        label:
          `${student.user?.name ?? ""} ${student.user?.lastName ?? ""}`.trim(),
      }));
    }

    const res = (await UserService.getMyStudents(1, 20, search)) as unknown;
    let list: StudentLike[] = [];

    if (isRecord(res)) {
      const data = res["data"];
      if (Array.isArray(data)) list = asStudentList(data);
      else if (isRecord(data) && Array.isArray(data["data"]))
        list = asStudentList(data["data"]);
    }

    return (list ?? []).map((student) => ({
      id: student.id ?? 0,
      label:
        `${student.user?.name ?? ""} ${student.user?.lastName ?? ""}`.trim(),
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
        const list = (await UserService.fetchStudentSubject(
          studentId,
          careerId,
        )) as SubjectCareerWithState[];
        setSubjects(list ?? []);
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
        prev.map((subject) =>
          editedSubjects[subject.subjectId]
            ? {
                ...subject,
                subjectState: editedSubjects[subject.subjectId],
                updateAt: new Date(),
              }
            : subject,
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
                onChange={(changeEvent: React.ChangeEvent<HTMLSelectElement>) =>
                  setEditedSubjects((prevEdited) => ({
                    ...prevEdited,
                    [subject.subjectId]: changeEvent.target.value,
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

      {isTutor && (
        <ScheduleMeetingModal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            const params = new URLSearchParams(searchParams.toString());
            params.delete("openCreate");
            params.delete("studentId");
            router.replace(`/reuniones?${params.toString()}`, {
              scroll: false,
            });
          }}
          students={[]}
          onCreated={() => {
            setPage(1);
            loadMeetings(1);
            const params = new URLSearchParams(searchParams.toString());
            params.delete("openCreate");
            params.delete("studentId");
            router.replace(`/reuniones?${params.toString()}`, {
              scroll: false,
            });
          }}
        />
      )}

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
        loadTutors={loadTutorsForFilter}
        tutors={tutorsOptions}
        loadStudents={loadStudentsForFilter}
        current={filters}
        onApply={(appliedFilters: Filters) => {
          setFilters(appliedFilters);
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
          setFilters((prev) => ({ ...prev, studentId: undefined }));
          const params = new URLSearchParams(searchParams.toString());
          params.delete("createReportFor");
          params.delete("studentId");
          router.replace(`/reuniones?${params.toString()}`, { scroll: false });
        }}
        meetingId={reportMeetingId}
        studentId={reportStudentId}
        onCreated={() => {
          loadMeetings(page);

          onReportClose();
          setReportMeetingId(null);
          setReportStudentId(null);
          setFilters((prev) => ({ ...prev, studentId: undefined }));
          const params = new URLSearchParams(searchParams.toString());
          params.delete("createReportFor");
          params.delete("studentId");

          if (reportMeetingId) {
            params.set("viewReportFor", String(reportMeetingId));
          }

          router.replace(`/reuniones?${params.toString()}`, { scroll: false });

          setViewMeetingId(reportMeetingId);
          setViewStudentId(reportStudentId);

          onViewOpen();

          setReportMeetingId(null);
          setReportStudentId(null);
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
          renderSubjectNowView={(
            subjectItem: SubjectCareerWithState,
            rowIndex: number,
          ) => (
            <Tr key={subjectItem.subjectId ?? rowIndex}>
              <Td>{subjectItem.subjectName}</Td>
              <Td>{subjectItem.year}</Td>
              <Td>{subjectItem.subjectState}</Td>
              <Td>
                {subjectItem.updateAt
                  ? new Date(subjectItem.updateAt).toLocaleDateString("es-AR")
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
