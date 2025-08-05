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
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Student } from "../../../app/interfaces/student.interface";
import { UserService } from "../../../services/admin-service";

import Select from "react-select";

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
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<any[]>([]);

  const handleInputChange = (value: string) => {
    const trimmed = value.trim();

    // Esto evita requests vacíos o muy cortos
    if (trimmed.length < 3) {
      setOptions([]);
      return;
    }

    // Llamás async por fuera
    fetchStudents(trimmed).then(setOptions);

    return value; // ← esto es CLAVE para evitar que se rompa el select
  };

  useEffect(() => {
    if (isOpen) {
      setStudents([]);
      setSelectedStudents([]);
      setOptions([]);
      setLoading(false); // no hay carga inicial porque AsyncPaginate hace su propia
    }
  }, [isOpen]);

  const handleAssign = async () => {
    try {
      await UserService.assignStudentsToTutor({
        tutorId,
        studentsIds: selectedStudents.map((s) => s.id),
      });
      toast({ title: "Asignación exitosa", status: "success" });
      onAssignSuccess();
      onClose();
    } catch {
      toast({ title: "Error al asignar", status: "error" });
    }
  };

  const fetchStudents = async (inputValue: string) => {
    try {
      const { data } = await UserService.getStudentsWithoutTutor(
        1,
        inputValue,
        100
      );

      setStudents(data);

      return data.map((s: Student) => ({
        label: `${s.user.name} ${s.user.lastName} (${s.user.email})`,
        value: s.id,
      }));
    } catch (error) {
      console.error("Error cargando estudiantes:", error);
      return [];
    }
  };

  const handleSelectChange = (selectedOptions: any) => {
    const selectedIds = selectedOptions.map((opt: any) => opt.value);
    const filtered = students.filter((s) => selectedIds.includes(s.id));
    setSelectedStudents(filtered);
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
          ) : (
            <Select
              isMulti
              options={options}
              value={selectedStudents.map((s) => ({
                value: s.id,
                label: `${s.user.name} ${s.user.lastName} (${s.user.email})`,
              }))}
              onChange={handleSelectChange}
              onInputChange={handleInputChange} // <- ahora sí funciona bien
              placeholder="Buscar estudiantes..."
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#3182ce",
                  borderRadius: "8px",
                  boxShadow: "none",
                  "&:hover": { borderColor: "#2b6cb0" },
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: "#3182ce",
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: "white",
                }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: "white",
                  ":hover": {
                    backgroundColor: "#2c5282",
                    color: "white",
                  },
                }),
              }}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={handleAssign}
            isDisabled={selectedStudents.length === 0}
          >
            Confirmar asignación
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
