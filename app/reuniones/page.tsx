// src/pages/reuniones/index.tsx
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
  Link as ChakraLink,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import GenericTable from "../../common/components/generic-table";
import { UserService } from "../../services/admin-service";
import EditMeetingModal from "./modals/edit-meeting-modal";
import FilterMeetingsModal, { Filters } from "./modals/filtro-busqueda-modal";
import ScheduleMeetingModal from "./modals/schedule-meetings-modals";
import { MeetingRow } from "./type/meeting-row.type";
import { useSidebar } from "../contexts/SidebarContext";
import NextLink from "next/link";
import CreateReportModal from "./modals/create-report-modal";
import { useRouter, useSearchParams } from "next/navigation";
import { FiFilePlus, FiFileText } from "react-icons/fi";
import ViewReportModal from './modals/view-report-modal';

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
};

/* =========================
   Utils
   ========================= */
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
  const toast = useToast();
  const initialRef = useRef<HTMLInputElement | null>(null);
  const { collapsed } = useSidebar();

  const [page, setPage] = useState(1);
  const [limit] = useState(7);

  const searchParams = useSearchParams();
  const router = useRouter();

  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure(); // crear meeting
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

  const [meetingToEdit, setMeetingToEdit] = useState<MeetingRow | null>(null);

  const {
    isOpen: isFilterOpen,
    onOpen: onFilterOpen,
    onClose: onFilterClose,
  } = useDisclosure();

  const [filters, setFilters] = useState<Filters>({
    status: "all",
    order: "asc",
  });
  const [studentsOptions, setStudentsOptions] = useState<StudentOption[]>([]);

  // Modal de Reporte
  const {
    isOpen: isReportOpen,
    onOpen: onReportOpen,
    onClose: onReportClose,
  } = useDisclosure();
  const [reportMeetingId, setReportMeetingId] = useState<number | null>(null);

  // Deep-links por query param
  useEffect(() => {
    // Abrir "Crear reporte" si viene ?createReportFor=ID
    const crf = Number(searchParams.get("createReportFor"));
    if (Number.isInteger(crf) && crf > 0) {
      setReportMeetingId(crf);
      onReportOpen();
    }
    // Abrir "Agendar" si viene ?openCreate=1 (opcional: preselección de alumno con ?studentId=)
    const shouldOpenCreate = searchParams.get("openCreate") === "1";
    if (shouldOpenCreate) {
      onOpen();
      setTimeout(() => initialRef.current?.focus(), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // sólo primera carga

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

          {/* solo mostrar si NO está pendiente */}
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
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("createReportFor", String(r.id));
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
                  // (opcional) deeplink para refrescar/compartir
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
      const uniqueStudents = new Map<number, string>();

      const mapped: Row[] = (meetingsRes.data ?? []).map(
        (m: GetMeetingsResp["data"][number]) => {
          const student = m?.tutorship?.student ?? null;
          const studentUser = student?.user ?? null;
          const alumno = fullName(studentUser);

          if (student?.id) uniqueStudents.set(student.id, alumno);

          const fecha = formatFecha(m.date);
          const hora = formatHora(m.date, m.time);

          return {
            id: m.id,
            tutor: "—",
            alumno,
            fecha,
            hora,
            fechaHora: `${fecha} ${hora}`,
            aula: m.location,
            status: m.status,
          };
        }
      );

      setRows(mapped);
      setTotal(meetingsRes.total ?? mapped.length);
      setStudentsOptions(
        Array.from(uniqueStudents, ([id, label]) => ({ id, label }))
      );
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
    // abrir modal y dejar URL shareable: ?openCreate=1
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

  const defaultStudentIdFromQuery = Number(searchParams.get("studentId"));
  const defaultStudentId =
    Number.isInteger(defaultStudentIdFromQuery) && defaultStudentIdFromQuery > 0
      ? defaultStudentIdFromQuery
      : undefined;

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
        students={studentsOptions}
        // si tu modal soporta preselección por prop:
        // defaultStudentId={defaultStudentId}
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
          setFilters({ status: "all", order: "asc" });
          setPage(1);
        }}
      />

      <CreateReportModal
        isOpen={isReportOpen}
        onClose={() => {
          onReportClose();
          setReportMeetingId(null);
          const params = new URLSearchParams(searchParams.toString());
          params.delete("createReportFor");
          router.replace(`/reuniones?${params.toString()}`, { scroll: false });
        }}
        meetingId={reportMeetingId}
        onCreated={() => {
          onReportClose();
          setReportMeetingId(null);
          const params = new URLSearchParams(searchParams.toString());
          params.delete("createReportFor");
          router.replace(`/reuniones?${params.toString()}`, { scroll: false });
          loadMeetings(page);
        }}
      />
      <ViewReportModal
        isOpen={isViewOpen}
        onClose={() => {
          onViewClose();
          setViewMeetingId(null);
          const params = new URLSearchParams(searchParams.toString());
          params.delete("viewReportFor");
          router.replace(`/reuniones?${params.toString()}`, { scroll: false });
        }}
        meetingId={viewMeetingId}
        onDeleted={() => {
          // si eliminan el reporte, refrescamos la tabla (status pasa a REPORTMISSING o PENDING)
          loadMeetings(page);
        }}
      />
    </>
  );
};

export default Reuniones;
