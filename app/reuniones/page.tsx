"use client";

import { DeleteIcon, EditIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Image,
  Td,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import GenericTable from "../../common/components/generic-table";
import { UserService } from "../../services/admin-service";
import EditMeetingModal from "./modals/edit-meeting-modal";
import FilterMeetingsModal, { Filters } from "./modals/filtro-busqueda-modal";
import ScheduleMeetingModal from "./modals/schedule-meetings-modals";
import { MeetingRow } from "./type/meeting-row.type";
import { useSidebar } from "../contexts/SidebarContext";

type StudentOption = { id: number; label: string };
type Row = MeetingRow & { fecha: string; hora: string };

function fullName(u?: { name?: string; lastName?: string; email?: string }) {
  return [u?.name, u?.lastName].filter(Boolean).join(" ") || u?.email || "-";
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

function isFuture(dateISO: string, time?: string) {
  try {
    const d = new Date(dateISO);
    if (time && /^\d{1,2}:\d{2}/.test(time)) {
      const [hh, mm] = time.split(":").map(Number);
      d.setHours(hh || 0, mm || 0, 0, 0);
    }
    return d.getTime() >= Date.now();
  } catch {
    return false;
  }
}

function getTutorNameFromToken(): string | null {
  try {
    const raw = localStorage.getItem("authTokens");
    if (!raw) return null;
    const obj = JSON.parse(raw);
    const token: string =
      obj?.accessToken || obj?.access_token || obj?.token || "";
    if (!token.includes(".")) return null;
    const payload = JSON.parse(atob(token.split(".")[1] ?? ""));
    const nameLike = fullName({
      name: payload?.name,
      lastName: payload?.lastName,
      email: payload?.email,
    });
    return nameLike && nameLike !== "-" ? nameLike : null;
  } catch {
    return null;
  }
}

const Reuniones: React.FC = () => {
  const toast = useToast();
  const initialRef = useRef<HTMLInputElement | null>(null);
  const { collapsed } = useSidebar();

  const [page, setPage] = useState(1);
  const [limit] = useState(7);

  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure(); // crear
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const [meetingToEdit, setMeetingToEdit] = useState<MeetingRow | null>(null);
  const [tutorName, setTutorName] = useState<string>(
    () => getTutorNameFromToken() ?? "—"
  );

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
      <Td>
        <Image
          src={r.status ? "/icons/true-check.svg" : "/icons/false-check.svg"}
          alt={r.status ? "True" : "False"}
          boxSize={30}
        />
      </Td>
      <Td>
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
          mr={2}
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
      </Td>
    </Tr>
  );

  async function loadMeetings(p = page) {
    setLoading(true);
    try {
      const meetingsRes = await UserService.getMyMeetings(p, limit, filters);

      if (tutorName === "—") {
        const t = getTutorNameFromToken();
        if (t) setTutorName(t);
      }

      const uniqueStudents = new Map<number, string>();

      const mapped: Row[] = (meetingsRes.data ?? []).map((m: any) => {
        const student = m?.tutorship?.student ?? null;
        const studentUser = student?.user ?? null;
        const alumno = studentUser ? fullName(studentUser) : "-";

        if (student?.id) {
          const label = fullName(studentUser) || "-";
          uniqueStudents.set(student.id, label);
        }

        const fecha = formatFecha(m.date);
        const hora = formatHora(m.date, m.time);

        return {
          id: m.id,
          tutor: tutorName || "—",
          alumno,
          fecha,
          hora,
          // compat si algo sigue usando fechaHora
          fechaHora: `${fecha} ${hora}`,
          aula: m.location,
          status: isFuture(m.date, m.time),
        };
      });

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
    setMeetingToEdit(row);
    onEditOpen();
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
        onClose={onClose}
        students={studentsOptions}
        onCreated={() => {
          setPage(1);
          loadMeetings(1);
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
    </>
  );
};

export default Reuniones;
