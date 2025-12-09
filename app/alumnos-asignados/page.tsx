"use client";
import { AddIcon, ArrowBackIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  IconButton,
  Td,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import GenericTable from "../../common/components/generic-table";
import { UserService } from "../../services/admin-service";
import { Student } from "../alumnos/interfaces/student.interface";
import AvailableStudentsModal from "../alumnos/modals/avilable-student.modal";
import { useSidebar } from "../contexts/SidebarContext";

const AlumnosAsignados: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tutorId = Number(searchParams.get("tutorId"));
  const fromPage = searchParams.get("fromPage") || "1";

  const initialPage = Number(searchParams.get("page") || 1);
  const [page, setPage] = useState(initialPage);
  const resultsPerPage = 7;
  const [total, setTotal] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState<[string, "ASC" | "DESC"] | undefined>(
    undefined
  );

  const [students, setStudents] = useState<Student[]>([]);
  const [tutorName, setTutorName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const { collapsed } = useSidebar();
  const offset = collapsed ? "6.5rem" : "17rem";

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const TableHeader = ["Nombre", "Apellido", "Correo"];

  const loadData = async (p = 1) => {
    if (!tutorId) return;
    try {
      const apiOrder = orderBy
        ? `${orderBy[0]}:${orderBy[1].toLowerCase()}`
        : undefined;

      const params: {
        currentPage: number;
        resultsPerPage: number;
        search: string;
        orderBy?: string;
      } = {
        currentPage: p,
        resultsPerPage,
        search: searchTerm,
        ...(apiOrder ? { orderBy: apiOrder } : {}),
      };

      const res = await UserService.getStudentsByTutor(tutorId, params);

      setStudents(res.data ?? []);
      setTotal(res.total ?? res.data?.length ?? 0);

      const tutor = await UserService.fetchUserById(tutorId);
      setTutorName(`${tutor.name} ${tutor.lastName}`);
    } catch (e) {
      console.error("Error al cargar datos:", e);
      setError("No se pudo cargar la lista.");
    }
  };

  const firstLoadRef = useRef(false);
  useEffect(() => {
    if (!firstLoadRef.current) {
      firstLoadRef.current = true;
      loadData(initialPage);
      return;
    }
    loadData(page);
  }, [page, searchTerm, orderBy, tutorId]);

  const refreshStudents = async () => {
    await loadData(page);
    toast.closeAll();
  };

  const handleAsignacionExitosa = async () => {
    await refreshStudents();
  };

  const handleDeleteAssignment = async (studentId: number) => {
    try {
      await UserService.deleteAssignment({ tutorId, studentId });
      await refreshStudents();
    } catch {}
  };

  const handleOrderChange = (field: string, direction: "ASC" | "DESC") => {
    setOrderBy([field, direction]);
    setPage(1);
  };

  const onPageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams as any);
    params.set("page", String(newPage));
    if (tutorId) params.set("tutorId", String(tutorId));
    if (fromPage) params.set("fromPage", String(fromPage));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const renderStudentRow = (student: Student) => (
    <Tr key={student.id}>
      <Td>{student.user.name}</Td>
      <Td>{student.user.lastName}</Td>
      <Td>{student.user.email}</Td>
      <Td>
        <IconButton
          icon={<DeleteIcon boxSize={5} />}
          aria-label="Eliminar"
          backgroundColor="white"
          _hover={{
            borderRadius: 15,
            backgroundColor: "#318AE4",
            color: "White",
          }}
          onClick={() => handleDeleteAssignment(student.id)}
        />
      </Td>
    </Tr>
  );

  return (
    <>
      {error && <p>{error}</p>}

      <Box pl={offset} pr={4} mt={5} mb={2}>
        <IconButton
          icon={<ArrowBackIcon />}
          aria-label="Volver"
          variant="ghost"
          colorScheme="blue"
          onClick={() => {
            router.push(`/tutores?page=${fromPage || 1}`);
          }}
        />
      </Box>

      <GenericTable<Student>
        caption={`Alumnos asignados a ${tutorName || "—"}`}
        data={students} 
        TableHeader={TableHeader}
        renderRow={(student: Student, index: number) => (
          <Tr key={student.id}>
            <Td>{student.user.name}</Td>
            <Td>{student.user.lastName}</Td>
            <Td>{student.user.email}</Td>
            <Td>
              <IconButton
                icon={<DeleteIcon boxSize={5} />}
                aria-label="Eliminar"
                backgroundColor="white"
                _hover={{
                  borderRadius: 15,
                  backgroundColor: "#318AE4",
                  color: "White",
                }}
                onClick={() => handleDeleteAssignment(student.id)}
              />
            </Td>
          </Tr>
        )}
        /* paginado (server mode) */
        currentPage={page}
        itemsPerPage={resultsPerPage}
        totalItems={total}
        onPageChange={onPageChange}
        /* búsqueda / orden */
        searchTerm={searchTerm}
        onSearch={(t) => {
          setSearchTerm(t);
          setPage(1);
        }}
        orderBy={orderBy}
        onOrderChange={handleOrderChange}
        /* UI */
        filter={false}
        topRightComponent={
          <IconButton
            borderRadius="50%"
            icon={<AddIcon />}
            aria-label="Agregar estudiante"
            backgroundColor="#318AE4"
            color="white"
            boxSize="40px"
            _hover={{ backgroundColor: "#2563eb" }}
            onClick={onOpen}
          />
        }
      />

      <AvailableStudentsModal
        isOpen={isOpen}
        onClose={onClose}
        tutorId={tutorId}
        onAssignSuccess={handleAsignacionExitosa}
      />
    </>
  );
};

export default AlumnosAsignados;
