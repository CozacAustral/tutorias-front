// app/reuniones/page.tsx  (reemplazar por completo)

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box, Button, Flex, Heading, HStack, Image, Input, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  Select, FormControl, FormLabel, useDisclosure, useToast, Td, Tr
} from "@chakra-ui/react";
import GenericTable from "../../common/components/generic-table";
import { UserService } from "../../services/admin-service";
import { MeetingRow } from './type/meeting-row.type';

type StudentOption = { id: number; label: string };

function fullName(u?: { name?: string; lastName?: string; email?: string }) {
  return [u?.name, u?.lastName].filter(Boolean).join(" ") || u?.email || "-";
}
function formatFechaHora(dateISO: string, time: string) {
  try {
    const d = new Date(dateISO);
    const f = d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
    const h = time || d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    return `${f} ${h}`;
  } catch { return `${dateISO} ${time}`; }
}
function isFuture(dateISO: string, time: string) {
  try {
    const d = new Date(dateISO);
    if (/^\d{1,2}:\d{2}/.test(time)) {
      const [hh, mm] = time.split(":").map(Number);
      d.setHours(hh || 0, mm || 0, 0, 0);
    }
    return d.getTime() >= Date.now();
  } catch { return false; }
}

// Lee nombre del tutor desde el JWT (si lo guardás en localStorage)
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
  } catch { return null; }
}

const Reuniones: React.FC = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef<HTMLInputElement | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [rows, setRows] = useState<MeetingRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [students, setStudents] = useState<StudentOption[]>([]);
  const [studentId, setStudentId] = useState<number | "">("");
  const [dateValue, setDateValue] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [locationValue, setLocationValue] = useState("");

  const [tutorName, setTutorName] = useState<string>(() => getTutorNameFromToken() ?? "—");

  const headers = useMemo(() => ["Tutor", "Alumno", "Fecha y hora", "Aula", "Status"], []);

  const renderRow = (r: MeetingRow) => (
    <Tr key={r.id}>
      <Td>{r.tutor}</Td>
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
    </Tr>
  );

  async function loadMeetingsAndStudents(p = page) {
    setLoading(true);
    try {
      // Traé TODOS tus alumnos (o un número grande) para no fallar al mapear por id
      const [meetingsRes, studentsRes] = await Promise.all([
        UserService.getMyMeetings(p, limit),
        UserService.getMyStudents({ currentPage: 1, resultsPerPage: 100 }),
      ]);

      // idEstudiante -> Nombre completo
      const studentsMap = new Map<number, string>(
        (studentsRes.data ?? []).map((s: any) => [s.id, fullName(s.user)])
      );

      // (opcional) si querés reforzar tutorName cuando guardás sesión después del 1er render
      if (tutorName === "—") {
        const t = getTutorNameFromToken();
        if (t) setTutorName(t);
      }

      const mapped: MeetingRow[] = (meetingsRes.data ?? []).map((m: any) => {
        // Resuelve el ID del alumno desde cualquier forma posible que venga
        const studentObj: any =
          m?.student ??
          m?.tutorship?.student ??
          null;

        const sId: number | null =
          m?.studentId ??
          studentObj?.id ??
          m?.tutorship?.studentId ??
          null;

        // Nombre de alumno: usa el objeto si viene, sino usa el mapa por id
        const alumno =
          studentObj?.user
            ? fullName(studentObj.user)
            : (sId && studentsMap.has(sId))
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
      setStudents(
        (studentsRes.data ?? []).map((s: any) => ({
          id: s.id,
          label: fullName(s.user),
        }))
      );
    } catch (e: any) {
      toast({ title: "Error al cargar reuniones", description: e?.message ?? "", status: "error" });
      setRows([]); setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadMeetingsAndStudents(page); }, [page]);

  const openCreate = async () => {
    if (!students.length) {
      try {
        const res = await UserService.getMyStudents({ currentPage: 1, resultsPerPage: 100 });
        setStudents(res.data.map((s: any) => ({ id: s.id, label: fullName(s.user) })));
      } catch {}
    }
    onOpen();
    setTimeout(() => initialRef.current?.focus(), 0);
  };

  const resetForm = () => {
    setStudentId(""); setDateValue(""); setTimeValue(""); setLocationValue("");
  };

  const handleCreate = async () => {
    if (!studentId || !dateValue || !timeValue || !locationValue) {
      toast({ title: "Faltan datos", description: "Completá alumno, fecha, hora y aula.", status: "warning" });
      return;
    }
    try {
      await UserService.schedule({
        studentId: Number(studentId),
        date: new Date(dateValue).toISOString(),
        time: timeValue,
        location: locationValue,
      });
      toast({ title: "Reunión creada", status: "success" });
      onClose(); resetForm();
      setPage(1); await loadMeetingsAndStudents(1);
    } catch (e: any) {
      toast({ title: "Error al crear", description: e?.message ?? "", status: "error" });
    }
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
              <Button onClick={openCreate} isLoading={loading}>+ Agendar</Button>
            </HStack>
          }
          minH="500px"
        />
      </Box>

      <Modal isOpen={isOpen} onClose={() => { onClose(); resetForm(); }} size="xl" initialFocusRef={initialRef}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agenda una reunión</ModalHeader>
          <ModalCloseButton />
        <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Alumno</FormLabel>
              <Select
                ref={initialRef as any}
                placeholder="Seleccionar alumno"
                value={studentId}
                onChange={(e) => setStudentId(Number(e.target.value))}
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Fecha</FormLabel>
              <Input type="date" value={dateValue} onChange={(e) => setDateValue(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Hora</FormLabel>
              <Input type="time" value={timeValue} onChange={(e) => setTimeValue(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Aula</FormLabel>
              <Input placeholder="A1 / B2 / etc." value={locationValue} onChange={(e) => setLocationValue(e.target.value)} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} isLoading={loading} onClick={handleCreate}>
              Guardar
            </Button>
            <Button onClick={() => { onClose(); resetForm(); }}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Reuniones;
