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
import { Student } from "../alumnos/interfaces/student.interface";
import { SubjectCareerWithState } from "../alumnos/interfaces/subject-career-student.interface";
import SubjectModal from "../alumnos/modals/subject-student.modal";
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
import { StudentOption } from "./type/student-option.type";

function studentLabel(s: Pick<Student, "id" | "user"> | any) {
  const name = s?.user?.name ?? "";
  const last = s?.user?.lastName ?? "";
  const email = s?.user?.email ?? "";
  const full = [name, last].filter(Boolean).join(" ");
  return full || email || `Alumno #${s?.id ?? "-"}`;
}

function fullName(
  u?: { name?: string; lastName?: string; email?: string } | null
) {
  if (!u) return "-";
  return [u.name, u.lastName].filter(Boolean).join(" ") || u.email || "-";
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatFecha(dateISO: string) {
  try {
    const d = new Date(dateISO);
    return d.toLocaleDateString("es-AR", {
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
    const d = new Date(dateISO);
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  } catch {
    return time ?? "";
  }
}

function statusBadge(s: MeetingStatus) {
  const label =
    s === "COMPLETED"
      ? "Completada"
      : s === "PENDING"
        ? "Pendiente"
        : s === "REPORTMISSING"
          ? "Falta reporte"
          : "—";

  switch (s) {
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

function toMeetingRow(r: Row): MeetingRow {
  return {
    ...r,
    fechaHora: r.fechaHora ?? `${r.fecha} ${r.hora}`,
    status: r.status === "COMPLETED",
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
  const [me, setMe] = useState<any>(null);

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
    {}
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
  const SUBJECT_STATE_LABELS: Record<string, string> = {
    APPROVED: "Aprobada",
    REGULARIZED: "Regularizada",
    FREE: "Libre",
    INPROGRESS: "En curso",
    NOTATTENDED: "No cursada",
    RETAKING: "Recursando",
  };

  function normalizeSubjectStateKey(v: any) {
    return String(v ?? "")
      .trim()
      .toUpperCase()
      .replace(/[\s_]/g, "");
  }

  function subjectStateLabel(v: any) {
    const k = normalizeSubjectStateKey(v);
    return SUBJECT_STATE_LABELS[k] ?? String(v ?? "—");
  }

  function subjectStateValueForSelect(v: any) {
    const k = normalizeSubjectStateKey(v);
    if (k in SUBJECT_STATE_LABELS) return k;
    return String(v ?? "")
      .trim()
      .toUpperCase();
  }

  const headers = useMemo(
    () =>
      isTutor
        ? ["Alumno", "Fecha", "Hora", "Aula", "Status", "Acciones"]
        : ["Alumno", "Fecha", "Hora", "Aula", "Status"],
    [isTutor]
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
    [onEditOpen]
  );

  const renderRow = useCallback(
    (r: Row) => (
      <Tr key={r.id}>
        <Td>{r.alumno}</Td>
        <Td>{r.fecha}</Td>
        <Td>{r.hora}</Td>
        <Td>{r.aula}</Td>
        <Td>{statusBadge(r.status)}</Td>
        {isTutor && (
          <Td>
            <HStack spacing={2}>
              {r.status !== "COMPLETED" && (
                <IconButton
                  aria-label="Editar reunión"
                  icon={<EditIcon boxSize={5} />}
                  backgroundColor="white"
                  onClick={() => handleEdit(r)}
                  _hover={{
                    borderRadius: 15,
                    backgroundColor: "#318AE4",
                    color: "white",
                  }}
                />
              )}
              {r.status !== "COMPLETED" && (
                <IconButton
                  aria-label="Eliminar reunión"
                  icon={<DeleteIcon boxSize={5} />}
                  backgroundColor="white"
                  onClick={() => requestDelete(r)}
                  _hover={{
                    borderRadius: 15,
                    backgroundColor: "red.500",
                    color: "white",
                  }}
                />
              )}

              {r.status !== "PENDING" &&
                (r.status === "REPORTMISSING" ? (
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
                      setReportMeetingId(r.id);
                      setReportStudentId(r.studentId ?? null);
                      const params = new URLSearchParams(
                        searchParams.toString()
                      );
                      params.set("createReportFor", String(r.id));
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
                      setViewMeetingId(r.id);
                      setViewStudentId(r.studentId ?? null);
                      const params = new URLSearchParams(
                        searchParams.toString()
                      );
                      params.set("viewReportFor", String(r.id));
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
    ]
  );

  async function loadMeetings(p = page) {
    setLoading(true);
    try {
      const meetingsRes = await UserService.getMeetings(p, limit, {
        ...filters,
      });
      let foundTutorId: number | null = null;

      const mapped: Row[] = (meetingsRes.data ?? []).map(
        (m: GetMeetingsResp["data"][number]) => {
          const student = m?.tutorship?.student ?? null;
          const alumno = fullName(student?.user ?? null);

          const fecha = formatFecha(m.date);
          const hora = formatHora(m.date);

          const row: Row = {
            id: m.id,
            tutor: "—",
            alumno,
            fecha,
            hora,
            fechaHora: `${fecha} ${hora}`,
            aula: m.location,
            status: m.computedStatus ?? m.status,
            studentId: student?.id ?? m?.tutorship?.studentId ?? undefined,
            tutorId: m?.tutorship?.tutorId ?? undefined,
          };
          if (!foundTutorId && row.tutorId) foundTutorId = row.tutorId;
          return row;
        }
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
        const meRes = await UserService.getMyStudents(1, 500);
        let list: any[] =
          meRes?.data?.data ?? meRes?.data?.students ?? meRes?.data ?? [];

        if ((!list || list.length === 0) && tutorId) {
          const byId = await UserService.getStudentsByTutor(tutorId, {
            currentPage: 1,
            resultsPerPage: 7,
          });
          list = byId?.data ?? [];
        }

        const opts = (list ?? [])
          .map((s: any) => ({ id: s.id, label: studentLabel(s) }))
          .filter((s) => s.id && s.label)
          .reduce((acc: StudentOption[], cur: StudentOption) => {
            if (!acc.some((x) => x.id === cur.id)) acc.push(cur);
            return acc;
          }, [])
          .sort((a, b) => a.label.localeCompare(b.label, "es"));

        setStudentsOptions(opts);
      } catch {
        setStudentsOptions([]);
      } finally {
        setLoadingStudents(false);
      }
    },
    [isTutor]
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
    search: string
  ): Promise<{ id: number; label: string }[]> => {
    if (!me) return [];

    if (isAdmin) {
      const res = await UserService.fetchAllStudents({
        search,
        currentPage: 1,
        resultsPerPage: 20,
      });

      return res.students.map((s) => ({
        id: s.id,
        label: `${s.user?.name ?? ""} ${s.user?.lastName ?? ""}`.trim(),
      }));
    }

    const res = await UserService.getMyStudents(1, 20, search);
    const list = res.data?.data ?? [];

    return list.map((s: any) => ({
      id: s.id,
      label: `${s.user.name} ${s.user.lastName}`,
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
    [onSubjectsOpen]
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
            newState
          )
        )
      );

      setSubjects((prev) =>
        prev.map((s) =>
          editedSubjects[s.subjectId]
            ? {
                ...s,
                subjectState: editedSubjects[s.subjectId],
                updateAt: new Date(),
              }
            : s
        )
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
                onChange={(e) =>
                  setEditedSubjects((prev) => ({
                    ...prev,
                    [subject.subjectId]: e.target.value,
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
                    subject.subjectState
                  ),
                }))
              }
            />
          </Td>
        </Tr>
      );
    },
    [editedSubjects]
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
          setFilters((p) => ({ ...p, studentId: undefined }));
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
          setFilters((p) => ({ ...p, studentId: undefined }));
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
    </>
  );
};

export default Reuniones;
