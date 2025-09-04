"use client";
import {
  useDisclosure, useToast, Td, Tr, IconButton, Box
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AddIcon, ArrowBackIcon, DeleteIcon } from "@chakra-ui/icons";

import GenericTable from "../../common/components/generic-table";
import { UserService } from "../../services/admin-service";
import AvailableStudentsModal from "../../common/components/modals/avilable-students-modal";
import { Student } from "../interfaces/student.interface";
import { useSidebar } from "../contexts/SidebarContext";

const AlumnosAsignados: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get("page") || 1);
  const [page, setPage] = useState(initialPage);

  const { collapsed } = useSidebar();
  const offset = collapsed ? "6.5rem" : "17rem";

  const tutorId = Number(searchParams.get("tutorId"));
  const [students, setStudents] = useState<Student[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const TableHeader = ["Nombre", "Apellido", "Correo"]; // 👈 sin “Acciones”
  const [tutorName, setTutorName] = useState<string>("");

  const [total, setTotal] = useState(0);
  const resultsPerPage = 7;
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!tutorId) return;
    const fetchStudentsAndTutor = async () => {
      try {
        const res = await UserService.getStudentsByTutor(tutorId, {
          currentPage: page,
          resultsPerPage,
          search,
        });
        setStudents(res.data);
        setTotal(res.total);

        const tutor = await UserService.fetchUserById(tutorId);
        setTutorName(`${tutor.name} ${tutor.lastName}`);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError("No se pudo cargar la lista.");
      }
    };
    fetchStudentsAndTutor();
  }, [tutorId, page, search]);

  const refreshStudents = async () => {
    try {
      const res = await UserService.getStudentsByTutor(tutorId, {
        currentPage: page, resultsPerPage, search,
      });
      setStudents(res.data);
      setTotal(res.total);
    } catch {
      toast({ title: "Error", description: "No se pudieron actualizar los estudiantes.", status: "error" });
    }
  };

  const handleAsignacionExitosa = async () => {
    await refreshStudents();
    toast.closeAll();
    toast({ title: "Asignación exitosa", status: "success" });
  };

  const handleDeleteAssignment = async (studentId: number) => {
    try {
      await UserService.deleteAssignment({ tutorId, studentId });
      await refreshStudents();
      toast({ title: "Asignación eliminada", status: "success" });
    } catch {
      toast({ title: "Error al eliminar", status: "error" });
    }
  };

  const renderStudentRow = (student: Student) => (
    <Tr key={student.id}>
      <Td>{student.user.name}</Td>
      <Td>{student.user.lastName}</Td>
      <Td>{student.user.email}</Td>
      <Td textAlign="right" w="30px">
        <IconButton
          icon={<DeleteIcon boxSize={5} />}
          aria-label="Eliminar"
          backgroundColor="white"
          _hover={{ borderRadius: 15, backgroundColor: "#318AE4", color: "White" }}
          onClick={() => handleDeleteAssignment(student.id)}
        />
      </Td>
    </Tr>
  );

  return (
    <>
      {error && <p>{error}</p>}

      {/* Botón “Volver” alineado con el contenido */}
      <Box pl={offset} pr={4} mt={5} mb={2}>
        <IconButton
          icon={<ArrowBackIcon />}
          aria-label="Volver"
          variant="ghost"
          colorScheme="blue"
          onClick={() => {
            const fromPage = searchParams.get("fromPage");
            router.push(`/tutores?page=${fromPage || 1}`);
          }}
        />
      </Box>

      {students ? (
        <GenericTable
          offsetLeft={offset}
          pageTitle={`Alumnos asignados a ${tutorName}`} // 👈 título grande
          caption="Alumnos asignados"                    // (opcional) pero…
          hideToolbarCaption                             // 👈 …no lo pintes en el toolbar
          data={students}
          TableHeader={TableHeader}
          renderRow={renderStudentRow}
          showPagination
          currentPage={page}
          itemsPerPage={resultsPerPage}
          totalItems={total}
          onPageChange={(newPage) => setPage(newPage)}
          topRightComponent={
            <IconButton
              borderRadius="50%"
              icon={<AddIcon />}
              aria-label="Agregar estudiante"
              colorScheme="blue"
              onClick={onOpen}
            />
          }
        />
      ) : (
        <p>Loading...</p>
      )}

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
