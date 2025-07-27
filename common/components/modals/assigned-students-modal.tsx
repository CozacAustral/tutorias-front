"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  VStack,
  Text,
  Box,
  Spinner,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { Student } from "../../../app/interfaces/student.interface";
import { DeleteIcon } from "@chakra-ui/icons";
import { UserService } from "../../../services/admin-service";
import { useEffect, useState } from "react";
import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  students: Student[] | null;
  isLoading: boolean;
  tutorName: string;
  tutorId: number;
}

export default function AssignedStudentsModal({
  isOpen,
  onClose,
  students,
  isLoading,
  tutorName,
  tutorId,
}: Props) {
  const toast = useToast();
  const [localStudents, setLocalStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (students) {
      setLocalStudents(students);
    }
  }, [students]);

  const handleAsignarEstudiantes = () => {
    console.log("Asignar estudiantes a:", tutorId);
  };

  const handleDeleteAssignment = async (studentId: number) => {
    try {
      await UserService.deleteAssignment({ tutorId, studentId });
      setLocalStudents((prev) => prev.filter((s) => s.id !== studentId));
      toast({
        title: "Estudiante eliminado.",
        description: "Se eliminó la asignación correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error al eliminar asignación.",
        description: "No se pudo eliminar al estudiante.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Estudiantes asignados a {tutorName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading ? (
            <Spinner />
          ) : localStudents.length > 0 ? (
            <Box
              display="grid"
              gridTemplateColumns="repeat(3, 1fr)"
              gap={4}
              alignItems="center"
            >
              {students?.map((s) => (
                <React.Fragment key={s.id}>
                  <Box>
                    <Text fontWeight="bold">
                      {s.user.name} {s.user.lastName}
                    </Text>
                  </Box>
                  <Box>
                    <Text>{s.user.email}</Text>
                  </Box>
                  <Box textAlign="right">
                    <IconButton
                      icon={<DeleteIcon />}
                      aria-label="Eliminar asignación"
                      onClick={() => handleDeleteAssignment(s.id)}
                      colorScheme="red"
                      variant="ghost"
                      size="sm"
                    />
                  </Box>
                </React.Fragment>
              ))}
            </Box>
          ) : (
            <Text>No hay estudiantes asignados.</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            w="100%"
            onClick={handleAsignarEstudiantes}
          >
            Asignar estudiantes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
