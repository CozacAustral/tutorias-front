"use client";
import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Td,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import GenericTable from "../../../common/components/generic-table";
import { StudentCareer } from "../interfaces/student-career.interface";
import { SubjectCareerWithState } from "../interfaces/subject-career-student.interface";
import SubjectModal from "./subject-student.modal";

interface CareerModalEditProps {
  isOpen: boolean;
  onClose: () => void;
  careers: StudentCareer[];
  onViewSubjects?: (career: StudentCareer) => Promise<SubjectCareerWithState[]> | void;
  onDeleteCareer?: (career: StudentCareer) => void;
  onToggleActive?: (career: StudentCareer) => void;
  onEditSubjects?: (career: StudentCareer) => void;
  renderSubjectNow?: (
    subject: SubjectCareerWithState,
    index: number
  ) => React.ReactNode;
  onConfirmEditSubject?: (
    editedSubjects: Record<number, string>
  ) => Promise<void>;
  isViewMode?: boolean;
  role?: number;
}

const CareerModalEdit: React.FC<CareerModalEditProps> = ({
  isOpen,
  onClose,
  careers,
  onViewSubjects,
  onDeleteCareer,
  onToggleActive,
  renderSubjectNow,
  onConfirmEditSubject,
  isViewMode = false,
  role = 0,
}) => {
  const toast = useToast();
  const {
    isOpen: isSubjectModalOpen,
    onOpen: openSubjectModal,
    onClose: closeSubjectModal,
  } = useDisclosure();

  const [selectedCareer, setSelectedCareer] = useState<StudentCareer | null>(
    null
  );
  const [subjects, setSubjects] = useState<SubjectCareerWithState[]>([]);
  const [editedSubjects, setEditedSubjects] = useState<Record<number, string>>(
    {}
  );

  const handleViewSubjects = async (career: StudentCareer) => {
    if (!onViewSubjects) {
      toast({
        title: "Función no disponible",
        description: "No se ha definido la acción de ver materias.",
        status: "warning",
      });
      return;
    }

    try {
      const result = await onViewSubjects(career);
      if (Array.isArray(result)) {
        setSubjects(result);
      }
      setSelectedCareer(career);
      openSubjectModal();
    } catch {
      toast({
        title: "Error",
        description: "No se pudieron cargar las materias.",
        status: "error",
      });
    }
  };

  const handleEditSubjects = async (career: StudentCareer) => {
    // Igual que ver materias pero en modo edición
    await handleViewSubjects(career);
  };

  const handleDeleteCareer = (career: StudentCareer) => {
    if (!onDeleteCareer) {
      toast({
        title: "Función no disponible",
        description: "No se ha definido la acción de eliminar carrera.",
        status: "warning",
      });
      return;
    }
    onDeleteCareer(career);
  };

  const handleToggleActive = (career: StudentCareer) => {
    if (!onToggleActive) {
      toast({
        title: "Función no disponible",
        description: "No se ha definido la acción de cambiar estado.",
        status: "warning",
      });
      return;
    }
    onToggleActive(career);
  };

  const handleConfirmEditSubjects = async () => {
    if (onConfirmEditSubject) {
      await onConfirmEditSubject(editedSubjects);
      setEditedSubjects({});
      closeSubjectModal();
    }
  };

  const renderCareerRow = (career: StudentCareer, index: number) => (
    <Tr key={index}>
      <Td>{career.name}</Td>
      <Td>{career.active ? "Activa" : "Inactiva"}</Td>
      <Td>{career.yearEntry || "-"}</Td>
      <Td>{career.yearOfThePlan || "-"}</Td>
      <Td>
        <IconButton
          icon={<ViewIcon boxSize={5} />}
          aria-label="Ver materias"
          mr={2}
          backgroundColor="white"
          _hover={{ backgroundColor: "#318AE4", color: "white" }}
          onClick={() => handleViewSubjects(career)}
        />
        {!isViewMode && role !== 2 && (
          <>
            <IconButton
              icon={<EditIcon boxSize={5} />}
              aria-label="Editar materias"
              mr={2}
              backgroundColor="white"
              _hover={{ backgroundColor: "#318AE4", color: "white" }}
              onClick={() => handleEditSubjects(career)}
            />
            <IconButton
              icon={<DeleteIcon boxSize={5} />}
              aria-label="Eliminar carrera"
              mr={2}
              backgroundColor="white"
              _hover={{ backgroundColor: "#E53E3E", color: "white" }}
              onClick={() => handleDeleteCareer(career)}
            />
          </>
        )}
      </Td>
    </Tr>
  );

  return (
    <>
      {/* Modal de carreras */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
        <ModalOverlay />
        <ModalContent maxW="80vw" maxH="90vh" overflow="hidden">
          <ModalHeader fontSize="2xl" fontWeight="bold">
            Carreras del Alumno
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY="auto" p={0}>
            <Box width="100%" overflow="hidden">
              <GenericTable<StudentCareer>
                data={careers || []}
                TableHeader={[
                  "Carrera",
                  "Estado",
                  "Año de Ingreso",
                  "Año del Plan",
                  "Acciones",
                ]}
                caption="Listado de Carreras"
                renderRow={renderCareerRow}
                compact
                filter={false}
                itemsPerPage={3}
                showAddMenu={false}
                isInModal
                careerModalEdit
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de materias */}
      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={closeSubjectModal}
        onConfirm={handleConfirmEditSubjects}
        entityName="Materias"
        titleCareer={selectedCareer?.name}
        subjects={subjects}
        renderSubjectNow={renderSubjectNow}
        showButtonCancelSave={!isViewMode}
      />
    </>
  );
};

export default CareerModalEdit;
