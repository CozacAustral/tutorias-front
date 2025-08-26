"use client";

import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button, useToast, Spinner,
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

type Option = { value: number; label: string };

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
  const [options, setOptions] = useState<Option[]>([]);

  const toOption = (s: Student): Option => ({
    value: s.id,
    label: `${s.user.name} ${s.user.lastName} (${s.user.email})`,
  });

  const buildOptions = (list: Student[], selected: Student[]) => {
    const selectedIds = new Set(selected.map((s) => s.id));
    return list.filter((s) => !selectedIds.has(s.id)).map(toOption);
  };

  const fetchStudents = async (inputValue: string) => {
    try {
      const { data } = await UserService.getStudentsWithoutTutor(
        1,                 // page
        inputValue || "",  // search (vacío por defecto)
        2                // limit
      );
      setStudents(data);
      return buildOptions(data, selectedStudents);
    } catch (error) {
      console.error("Error cargando estudiantes:", error);
      return [] as Option[];
    }
  };

  // Carga inicial con search vacío
  useEffect(() => {
    let mounted = true;
    if (isOpen) {
      setStudents([]);
      setSelectedStudents([]);
      setOptions([]);
      setLoading(true);
      fetchStudents("").then((opts) => {
        if (!mounted) return;
        setOptions(opts);
        setLoading(false);
      });
    }
    return () => {
      mounted = false;
    };
  }, [isOpen]);

  const handleInputChange = (value: string) => {
    const q = value.trim();
    fetchStudents(q).then(setOptions);
    return value; // requerido por react-select
  };

  const handleSelectChange = (selectedOptions: any) => {
    const ids = (selectedOptions ?? []).map((o: Option) => o.value);
    // conservar seleccionados aunque no estén en el último fetch
    const pool = new Map<number, Student>([
      ...students.map((s) => [s.id, s] as const),
      ...selectedStudents.map((s) => [s.id, s] as const),
    ]);
    const nextSelected = ids
      .map((id: number) => pool.get(id))
      .filter(Boolean) as Student[];

    setSelectedStudents(nextSelected);
    // actualizar opciones ocultando los seleccionados actuales
    setOptions(buildOptions(students, nextSelected));
  };

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
              closeMenuOnSelect={false}
              hideSelectedOptions={true} // además filtramos manualmente
              options={options}
              value={selectedStudents.map(toOption)}
              onChange={handleSelectChange}
              onInputChange={handleInputChange}
              placeholder="Buscar estudiantes..."
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#3182ce",
                  borderRadius: "8px",
                  boxShadow: "none",
                  "&:hover": { borderColor: "#2b6cb0" },
                }),
                multiValue: (base) => ({ ...base, backgroundColor: "#3182ce" }),
                multiValueLabel: (base) => ({ ...base, color: "white" }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: "white",
                  ":hover": { backgroundColor: "#2c5282", color: "white" },
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
