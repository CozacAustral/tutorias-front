"use client";
import { useDisclosure, useToast, Td, Tr, IconButton } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Student } from "../interfaces/student.interface";
import GenericTable from "../../common/components/generic-table";
import { UserService } from "../../services/admin-service";
import AvailableStudentsModal from "../../common/components/modals/AvailableStudentsModal";
import { AddIcon } from "@chakra-ui/icons";
import { DeleteIcon } from "@chakra-ui/icons";

const AlumnosAsignados: React.FC = () => {
  const searchParams = useSearchParams();
  const tutorId = Number(searchParams.get("tutorId"));

  const [students, setStudents] = useState<Student[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const TableHeader = ["Nombre", "Apellido", "Correo", "Acciones"];

  const [tutorName, setTutorName] = useState<string>("");

  useEffect(() => {
    if (!tutorId) return;

    const fetchStudentsAndTutor = async () => {
      try {
        const data = await UserService.getStudentsByTutor(tutorId);
        setStudents(data);

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
  }, [tutorId]);

  const refreshStudents = async () => {
    try {
      const data = await UserService.getStudentsByTutor(tutorId);
      setStudents(data);
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
      await refreshStudents(); // ✅ solo refresca sin mostrar mensaje de asignación
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
      {students ? (
        <GenericTable
          data={students}
          TableHeader={TableHeader}
          caption={`Alumnos asignados al tutor ${tutorName}`}
          renderRow={renderStudentRow}
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
      <IconButton
        icon={<AddIcon />}
        aria-label="Agregar estudiante"
        colorScheme="blue"
        borderRadius="full"
        position="fixed"
        bottom="24px"
        right="24px"
        boxShadow="lg"
        size="lg"
        onClick={onOpen}
      />
    </>
  );
};

export default AlumnosAsignados;
