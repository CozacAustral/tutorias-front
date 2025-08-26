"use client";
import {
  useDisclosure,
  useToast,
  Td,
  Tr,
  IconButton,
  HStack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Student } from "../interfaces/student.interface";
import GenericTable from "../../common/components/generic-table";
import { UserService } from "../../services/admin-service";
import AvailableStudentsModal from "../../common/components/modals/AvailableStudentsModal";
import { AddIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

const AlumnosAsignados: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get("page") || 1);
  const [page, setPage] = useState(initialPage);

  const tutorId = Number(searchParams.get("tutorId"));

  const [students, setStudents] = useState<Student[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const TableHeader = ["Nombre", "Apellido", "Correo", "Acciones"];

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
        setTutorName(`${tutor.name}`);
      } catch (error) {
        console.error(
          "Error al cargar datos del tutor o sus estudiantes:",
          error
        );
        setError("No se pudo cargar la lista.");
      }
    };

    fetchStudentsAndTutor();
  }, [tutorId, page, search]);

  const refreshStudents = async () => {
    try {
      const res = await UserService.getStudentsByTutor(tutorId, {
        currentPage: page,
        resultsPerPage,
        search,
      });
      setStudents(res.data);
      setTotal(res.total);
    } catch {
      toast({
        title: "Error",
        description: "No se pudieron actualizar los estudiantes.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAsignacionExitosa = async () => {
    await refreshStudents();
    toast.closeAll();
    toast({
      title: "Asignación exitosa",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDeleteAssignment = async (studentId: number) => {
    try {
      await UserService.deleteAssignment({ tutorId, studentId });
      await refreshStudents();
      toast({
        title: "Asignación eliminada",
        description: "El estudiante fue desvinculado del tutor.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar la asignación.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
      {students ? (
        <GenericTable
          data={students}
          TableHeader={TableHeader}
          caption={
            <HStack
              spacing={3}
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
            >
              <IconButton
                icon={<ArrowBackIcon />}
                aria-label="Volver"
                onClick={() => {
                  const fromPage = searchParams.get("fromPage");
                  const page = fromPage || 1;
                  router.push(`/tutores?page=${page}`);
                }}
                variant="ghost"
                colorScheme="blue"
                flexShrink={0}
              />
              <Text
                fontWeight="bold"
                fontSize="4xl"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                Alumnos asignados al tutor {tutorName}
              </Text>
            </HStack>
          }
          renderRow={renderStudentRow}
          showPagination={true}
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
