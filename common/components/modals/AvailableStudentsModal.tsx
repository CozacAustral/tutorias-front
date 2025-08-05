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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchStudents = async (page = 1) => {
      try {
        const { data, total, limit } =
          await UserService.getStudentsWithoutTutor(page);
        setStudents((prev) => [...prev, ...data]);
        setHasMore(data.length === limit);
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
      setStudents([]);
      setSelectedStudents([]);
      setPage(1);
      setHasMore(true);
      setLoading(true);
      fetchStudents(1);
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

  const handleScrollToBottom = async () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    setTimeout(async () => {
      try {
        const nextPage = page + 1;
        const { data, total, limit } =
          await UserService.getStudentsWithoutTutor(nextPage);
        setStudents((prev) => [...prev, ...data]);
        setPage(nextPage);
        setHasMore(data.length === limit);
      } catch {
        toast({
          title: "Error",
          description: "No se pudieron cargar más estudiantes.",
          status: "error",
        });
      } finally {
        setLoadingMore(false);
      }
    }, 1000); // Delay de 1 segundo
  };

  const removeStudent = (id: number) => {
    setSelectedStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const options = students.map((s) => ({
    label: `${s.user.name} ${s.user.lastName} (${s.user.email})`,
    value: s.id,
  }));

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
          ) : students.length === 0 ? (
            "No hay estudiantes disponibles."
          ) : (
            <Select
              isMulti
              options={options}
              onChange={handleSelectChange}
              placeholder="Buscar estudiantes..."
              value={selectedStudents.map((s) => ({
                value: s.id,
                label: `${s.user.name} ${s.user.lastName} (${s.user.email})`,
              }))}
              isLoading={loadingMore}
              loadingMessage={() =>
                hasMore ? "Cargando más..." : "No hay más resultados"
              }
              onMenuScrollToBottom={handleScrollToBottom}
              menuPosition="fixed"
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
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
