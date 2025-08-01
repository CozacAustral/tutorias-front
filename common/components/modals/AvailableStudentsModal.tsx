"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  VStack,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Student } from "../../../app/interfaces/student.interface";
import { UserService } from "../../../services/admin-service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tutorId: number;
  onAssignSuccess: () => void;
}

export default function AvailableStudentsModal({
  isOpen,
  onClose,
  tutorId,
  onAssignSuccess,
}: Props) {
  const toast = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const result = await UserService.getStudentsWithoutTutor();
        setStudents(result);
      } catch {
        toast({
          title: "Error",
          description: "No se pudieron cargar los estudiantes disponibles.",
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      setSelectedIds([]); // limpiar selección anterior
      fetchStudents();
    }
  }, [isOpen, toast]);

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    try {
      await UserService.assignStudentsToTutor({
        tutorId,
        studentsIds: selectedIds,
      });
      toast({
        title: "Asignación exitosa",
        status: "success",
      });
      onAssignSuccess();
      onClose();
    } catch {
      toast({
        title: "Error al asignar",
        status: "error",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Seleccionar estudiantes</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Spinner />
          ) : students.length === 0 ? (
            "No hay estudiantes disponibles."
          ) : (
            <VStack align="stretch">
              {students.map((s) => (
                <Checkbox
                  key={s.id}
                  onChange={() => toggleSelection(s.id)}
                  isChecked={selectedIds.includes(s.id)}
                >
                  {s.user.name} {s.user.lastName} ({s.user.email})
                </Checkbox>
              ))}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={handleAssign}
            isDisabled={selectedIds.length === 0}
          >
            Confirmar asignación
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
