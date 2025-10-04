// app/reuniones/page.tsx  (reemplazar por completo)

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  useDisclosure,
  useToast,
  Td,
  Tr,
  IconButton,
} from "@chakra-ui/react";
import GenericTable from "../../common/components/generic-table";
import { UserService } from "../../services/admin-service";
import { MeetingRow } from "./type/meeting-row.type";
import ScheduleMeetingModal from "./modals/schedule-meetings-modals";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import EditMeetingModal from "./modals/edit-meeting-modal";

type StudentOption = { id: number; label: string };

function fullName(u?: { name?: string; lastName?: string; email?: string }) {
  return [u?.name, u?.lastName].filter(Boolean).join(" ") || u?.email || "-";
}
function formatFechaHora(dateISO: string, time: string) {
  try {
    const d = new Date(dateISO);
    const f = d.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const h =
      time ||
      d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    return `${f} ${h}`;
  } catch {
    return `${dateISO} ${time}`;
  }
}
function isFuture(dateISO: string, time: string) {
  try {
    const d = new Date(dateISO);
    if (/^\d{1,2}:\d{2}/.test(time)) {
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

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [rows, setRows] = useState<MeetingRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);


  const { isOpen, onOpen, onClose } = useDisclosure(); // modal crear
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

    const [meetingToEdit, setMeetingToEdit] = useState<MeetingRow | null>(null);

  const [tutorName, setTutorName] = useState<string>(
    () => getTutorNameFromToken() ?? "—"
  );

  // Opciones de alumnos para el modal
  const [studentsOptions, setStudentsOptions] = useState<StudentOption[]>([]);

  const headers = useMemo(
    () => ["Alumno", "Fecha y hora", "Aula", "Status", "Acciones"],
    []
  );

  const renderRow = (r: MeetingRow) => (
    <Tr key={r.id}>
      <Td>{r.alumno}</Td>
      <Td>{r.fechaHora}</Td>
      <Td>{r.aula}</Td>
      <Td>
        <Image
          src={r.status ? "/icons/true-check.svg" : "/icons/false-check.svg"}
          alt={r.status ? "True" : "False"}
          boxSize={6}
        />
      </Td>
      {/* 👇 Nueva celda de Acciones */}
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

  async function loadMeetingsAndStudents(p = page) {
    setLoading(true);
    try {
      const [meetingsRes, studentsRes] = await Promise.all([
        UserService.getMyMeetings(p, limit),
        UserService.getMyStudents({ currentPage: 1, resultsPerPage: 100 }),
      ]);

      const studentsMap = new Map<number, string>(
        (studentsRes.data ?? []).map((s: any) => [s.id, fullName(s.user)])
      );

      if (tutorName === "—") {
        const t = getTutorNameFromToken();
        if (t) setTutorName(t);
      }

      const mapped: MeetingRow[] = (meetingsRes.data ?? []).map((m: any) => {
        const studentObj: any = m?.student ?? m?.tutorship?.student ?? null;

        const sId: number | null =
          m?.studentId ?? studentObj?.id ?? m?.tutorship?.studentId ?? null;

        const alumno = studentObj?.user
          ? fullName(studentObj.user)
          : sId && studentsMap.has(sId)
            ? (studentsMap.get(sId) as string)
            : "-";

        return {
          id: m.id,
          tutor: tutorName || "—",
          alumno,
          fechaHora: formatFechaHora(m.date, m.time),
          aula: m.location,
          status: isFuture(m.date, m.time),
        };
      });

      setRows(mapped);
      setTotal(meetingsRes.total);

      setStudentsOptions(
        (studentsRes.data ?? []).map((s: any) => ({
          id: s.id,
          label: fullName(s.user),
        }))
      );
    } catch (e: any) {
      toast({
        title: "Error al cargar reuniones",
        description: e?.message ?? "",
        status: "error",
      });
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMeetingsAndStudents(page);
  }, [page]);

  const openCreate = async () => {
    if (!studentsOptions.length) {
      try {
        const res = await UserService.getMyStudents({
          currentPage: 1,
          resultsPerPage: 100,
        });
        setStudentsOptions(
          res.data.map((s: any) => ({ id: s.id, label: fullName(s.user) }))
        );
      } catch {}
    }
    onOpen();
    setTimeout(() => initialRef.current?.focus(), 0);
  };

  const handleDelete = async (row: MeetingRow) => {
    const ok = window.confirm(
      `¿Eliminar la reunión con ${row.alumno} del ${row.fechaHora}?`
    );
    if (!ok) return;
    try {
      await UserService.deleteMeeting(row.id);
      loadMeetingsAndStudents(page); // refresco
    } catch (e: any) {
      toast({
        title: "Error al eliminar",
        description: e?.message ?? "",
        status: "error",
      });
    }
  };

  const handleEdit = (row: MeetingRow) => {
    setMeetingToEdit(row);
    onEditOpen();
  };

  return (
    <Flex ml="15.625rem" direction="column" minHeight="100vh">
      <Box mt={4}>
        <GenericTable<MeetingRow>
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
          loadMeetingsAndStudents(1);
        }}
      />

      <EditMeetingModal
        isOpen={isEditOpen}
        onClose={() => {
          onEditClose();
          setMeetingToEdit(null);
        }}
        meeting={meetingToEdit}
        onUpdated={() => loadMeetingsAndStudents(page)}
      />
    </Flex>
  );
};

export default Reuniones;
