"use client";

import { DeleteIcon, EditIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  HStack,
  IconButton,
  Td,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiFilePlus, FiFileText } from "react-icons/fi";
import GenericTable from "../../common/components/generic-table";
import { UserService } from "../../services/admin-service";
import { useSidebar } from "../contexts/SidebarContext";
import CreateReportModal from "./modals/create-report-modal";
import EditMeetingModal from "./modals/edit-meeting-modal";
import FilterMeetingsModal, { Filters } from "./modals/filtro-busqueda-modal";
import ScheduleMeetingModal from "./modals/schedule-meetings-modals";
import ViewReportModal from "./modals/view-report-modal";
import { MeetingRow } from "./type/meeting-row.type";

import { SubjectCareerWithState } from "../alumnos/interfaces/subject-career-student.interface";
import SubjectModal from "../alumnos/modals/subject-student.modal";
import { Student } from "../alumnos/interfaces/student.interface";

/* =========================
   Tipos
   ========================= */
type MeetingStatus = "PENDING" | "CONFIRMED" | "REPORTMISSING";

type GetMeetingsResp = {
  data: {
    id: number;
    date: string;
    time: string;
    location: string;
    status: MeetingStatus;
    tutorship?: {
      student?: {
        id: number;
        user?: { name?: string; lastName?: string; email?: string };
      };
      studentId?: number;
      tutorId?: number;
    };
  }[];
  total: number;
  page: number;
  limit: number;
};

type StudentOption = { id: number; label: string };

type Row = Omit<MeetingRow, "status" | "fechaHora"> & {
  fecha: string;
  hora: string;
  status: MeetingStatus;
  fechaHora?: string;
  studentId?: number;
  tutorId?: number;
};

/* =========================
   Utils
   ========================= */
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
  switch (s) {
    case "CONFIRMED":
      return <Badge colorScheme="green">Confirmada</Badge>;
    case "PENDING":
      return <Badge colorScheme="yellow">Pendiente</Badge>;
    case "REPORTMISSING":
      return <Badge colorScheme="red">Falta reporte</Badge>;
    default:
      return <Badge>—</Badge>;
  }
}
function toMeetingRow(r: Row): MeetingRow {
  return {
    ...r,
    fechaHora: r.fechaHora ?? `${r.fecha} ${r.hora}`,
    status: r.status === "CONFIRMED",
  } as MeetingRow;
}

/* =========================
   Componente
   ========================= */
const Reuniones: React.FC = () => {
  const [reportStudentId, setReportStudentId] = useState<number | null>(null);

  const toast = useToast();
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

  // Modal de Reporte (crear)
  const {
    isOpen: isReportOpen,
    onOpen: onReportOpen,
    onClose: onReportClose,
  } = useDisclosure();
  const [reportMeetingId, setReportMeetingId] = useState<number | null>(null);

  // Modal de Materias
  const {
    isOpen: isSubjectsOpen,
    onOpen: onSubjectsOpen,
    onClose: onSubjectsClose,
  } = useDisclosure();
  const [subjects, setSubjects] = useState<SubjectCareerWithState[]>([]);
  const [subjectsTitle, setSubjectsTitle] = useState<string | undefined>();
  const [subjectsState] = useState<boolean | null>(null);
  const [subjectsRole] = useState<number | null>(2);

  // Deep-links por query param
  useEffect(() => {
    const crf = Number(searchParams.get("createReportFor"));
    if (Number.isInteger(crf) && crf > 0) {
      setReportMeetingId(crf);
      onReportOpen();
    }
    const shouldOpenCreate = searchParams.get("openCreate") === "1";
    if (shouldOpenCreate) {
      onOpen();
      setTimeout(() => initialRef.current?.focus(), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Alumno preseleccionado desde la URL
  const defaultStudentIdFromQuery = Number(searchParams.get("studentId"));
  const defaultStudentId =
    Number.isInteger(defaultStudentIdFromQuery) && defaultStudentIdFromQuery > 0
      ? defaultStudentIdFromQuery
      : undefined;

  useEffect(() => {
    if (defaultStudentId && !filters.studentId) {
      setFilters((p) => ({ ...p, studentId: defaultStudentId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultStudentId]);

  const headers = useMemo(
    () => ["Alumno", "Fecha", "Hora", "Aula", "Status", "Acciones"],
    []
  );

  const renderRow = (r: Row) => (
    <Tr key={r.id}>
      <Td>{r.alumno}</Td>
      <Td>{r.fecha}</Td>
      <Td>{r.hora}</Td>
      <Td>{r.aula}</Td>
      <Td>{statusBadge(r.status)}</Td>
      <Td>
        <HStack spacing={2}>
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
          <IconButton
            aria-label="Eliminar reunión"
            icon={<DeleteIcon boxSize={5} />}
            backgroundColor="white"
            onClick={() => handleDelete(r)}
            _hover={{
              borderRadius: 15,
              backgroundColor: "red.500",
              color: "white",
            }}
          />

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
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("createReportFor", String(r.id));
                  if (r.studentId) params.set("studentId", String(r.studentId));
                  router.replace(`/reuniones?${params.toString()}`, {
                    scroll: false,
                  });
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
                  const params = new URLSearchParams(searchParams.toString());
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
    </Tr>
  );

  async function loadMeetings(p = page) {
    setLoading(true);
    try {
      const meetingsRes = await UserService.getMyMeetings(p, limit, {
        ...filters,
      });
      let foundTutorId: number | null = null;

      const mapped: Row[] = (meetingsRes.data ?? []).map(
        (m: GetMeetingsResp["data"][number]) => {
          const student = m?.tutorship?.student ?? null;
          const alumno = fullName(student?.user ?? null);

          const fecha = formatFecha(m.date);
          const hora = formatHora(m.date, m.time);

          const row: Row = {
            id: m.id,
            tutor: "—",
            alumno,
            fecha,
            hora,
            fechaHora: `${fecha} ${hora}`,
            aula: m.location,
            status: m.status,
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
    } catch (e: any) {
      toast({
        title: "Error al cargar reuniones",
        description: e?.message ?? "",
        status: "error",
      });
      setRows([]);
      setTotal(0);
      setStudentsOptions([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMeetings(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, JSON.stringify(filters)]);

  const openCreate = async () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("openCreate", "1");
    router.replace(`/reuniones?${params.toString()}`, { scroll: false });
    onOpen();
    setTimeout(() => initialRef.current?.focus(), 0);
  };

  const handleDelete = async (row: Row) => {
    const ok = window.confirm(
      `¿Eliminar la reunión con ${row.alumno} del ${row.fecha} ${row.hora}?`
    );
    if (!ok) return;
    try {
      await UserService.deleteMeeting(row.id);
      loadMeetings(page);
    } catch (e: any) {
      toast({
        title: "Error al eliminar",
        description: e?.message ?? "",
        status: "error",
      });
    }
  };

  const handleEdit = (row: Row) => {
    setMeetingToEdit(toMeetingRow(row));
    onEditOpen();
  };

  async function loadStudentsForTutor(tutorId?: number | null) {
    setLoadingStudents(true);
    try {
      const meRes = await UserService.getMyStudents(1, 500);
      const meList: any[] =
        meRes?.data?.data ?? meRes?.data?.students ?? meRes?.data ?? [];

      let list = meList;

      if ((!list || list.length === 0) && tutorId) {
        const byId = await UserService.getStudentsByTutor(tutorId, {
          currentPage: 1,
          resultsPerPage: 500,
        });
        list = byId?.data ?? [];
      }

      const opts: StudentOption[] = (list ?? [])
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
  }

  // Cargar alumnos del tutor (me)
  useEffect(() => {
    loadStudentsForTutor(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fallback: si luego descubrimos myTutorId, reintentar por ID
  useEffect(() => {
    if (myTutorId) loadStudentsForTutor(myTutorId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myTutorId]);

  // ⬇️ handler que abre el SubjectModal y trae materias
  const handleOpenSubjects = async ({
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
      const list: SubjectCareerWithState[] =
        (await UserService.fetchStudentSubject(studentId, careerId)) ?? [];
      setSubjects(list);
      setSubjectsTitle(careerName);
      onSubjectsOpen();
    } catch (e: any) {
      toast({
        title: "No se pudieron cargar las materias",
        description: e?.message ?? "",
        status: "error",
      });
    }
  };

  // ⬇️ renderer para filas del SubjectModal
  const renderSubjectNow = (item: SubjectCareerWithState, idx: number) => {
    const anyItem = item as any;

    const nombre =
      anyItem?.subjectName ?? anyItem?.subject?.name ?? anyItem?.name ?? "—";

    const anio = anyItem?.year ?? anyItem?.anio ?? "—";

    const rawState = anyItem?.subjectState ?? anyItem?.state ?? anyItem?.active;

    const estado = (() => {
      if (rawState === true) return "Activa";
      if (rawState === false) return "Inactiva";
      switch (String(rawState ?? "").toUpperCase()) {
        case "NOTATTENDED":
          return "No cursada";
        case "INPROGRESS":
          return "Cursando";
        case "APPROVED":
          return "Aprobada";
        case "FAILED":
          return "Reprobada";
        case "ATTENDED":
          return "Cursada";
        default:
          return rawState ? String(rawState) : "—";
      }
    })();

    const updated =
      anyItem?.updateAt ?? anyItem?.updatedAt ?? anyItem?.lastUpdate ?? "—";

    return (
      <Tr key={idx}>
        <Td>{nombre}</Td>
        <Td>{anio}</Td>
        <Td>{estado}</Td>
        <Td>{typeof updated === "string" ? updated : "—"}</Td>
      </Tr>
    );
  };

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
              <Button onClick={openCreate} isLoading={loading}>
                + Agendar
              </Button>
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
          params.delete("studentId");
          router.replace(`/reuniones?${params.toString()}`, { scroll: false });
        }}
        students={[]}
        onCreated={() => {
          setPage(1);
          loadMeetings(1);
          const params = new URLSearchParams(searchParams.toString());
          params.delete("openCreate");
          params.delete("studentId");
          router.replace(`/reuniones?${params.toString()}`, { scroll: false });
        }}
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
        }}
        onConfirm={async () => {}}
        entityName="Materias"
        titleCareer={subjectsTitle}
        subjects={subjects}
        renderSubjectNow={renderSubjectNow}
        state={subjectsState}
        role={2}
        showButtonCancelSave={false}
      />
    </>
  );
};

export default Reuniones;
