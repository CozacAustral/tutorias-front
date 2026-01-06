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

type SubjectOpenMode = "view" | "edit";

interface CareerModalEditProps {
  isOpen: boolean;
  onClose: () => void;
  careers: StudentCareer[];

  onViewSubjects?: (
    career: StudentCareer
  ) => Promise<SubjectCareerWithState[]> | void;

  onDeleteCareer?: (career: StudentCareer) => void;
  onToggleActive?: (career: StudentCareer) => void;

  // 👇 renderer EDITABLE (el que tiene Select + lápiz)
  renderSubjectNow?: (
    subject: SubjectCareerWithState,
    index: number
  ) => React.ReactNode;

  // 👇 renderer SOLO LECTURA (sin Select ni acciones)
  renderSubjectNowView?: (
    subject: SubjectCareerWithState,
    index: number
  ) => React.ReactNode;

  isViewMode?: boolean;
  role?: number;

  onConfirmEditSubject?: () => Promise<void> | void;
}

const CareerModalEdit: React.FC<CareerModalEditProps> = ({
  isOpen,
  onClose,
  careers,
  onViewSubjects,
  onDeleteCareer,
  onToggleActive,
  renderSubjectNow,
  renderSubjectNowView,
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
  const [openMode, setOpenMode] = useState<SubjectOpenMode>("view");

  const loadSubjectsAndOpen = async (
    career: StudentCareer,
    mode: SubjectOpenMode
  ) => {
    if (!onViewSubjects) {
      toast({
        title: "Función no disponible",
        description: "No se ha definido la acción de ver materias.",
        status: "warning",
      });
      return;
    }

    try {
      setOpenMode(mode);

      const result = await onViewSubjects(career);
      if (Array.isArray(result)) setSubjects(result);

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

  const handleDeleteCareer = (career: StudentCareer) => {
    if (!onDeleteCareer) return;
    onDeleteCareer(career);
  };

  const handleToggleActive = (career: StudentCareer) => {
    if (!onToggleActive) return;
    onToggleActive(career);
  };

  const handleConfirmEditSubjects = async () => {
    if (!onConfirmEditSubject) {
      toast({
        title: "No se puede guardar",
        description:
          "No se definió la acción para guardar cambios de materias.",
        status: "warning",
      });
      return;
    }

    await onConfirmEditSubject();
    closeSubjectModal();
  };

  // ✅ solo se puede editar si:
  // - el StudentModal NO está en viewMode
  // - no es tutor
  // - y abriste con el lápiz (openMode === "edit")
  const canEditSubjects = !isViewMode && openMode === "edit";

  const renderCareerRow = (career: StudentCareer, index: number) => (
    <Tr key={index}>
      <Td>{career.name}</Td>
      <Td>{career.active ? "Activa" : "Inactiva"}</Td>
      <Td>{career.yearEntry || "-"}</Td>
      <Td>{career.yearOfThePlan || "-"}</Td>
      <Td>
        {/* 👁️ Ver materias (SIEMPRE solo lectura) */}
        <IconButton
          icon={<ViewIcon boxSize={5} />}
          aria-label="Ver materias"
          mr={2}
          backgroundColor="white"
          _hover={{ backgroundColor: "#318AE4", color: "white" }}
          onClick={() => loadSubjectsAndOpen(career, "view")}
        />

        {!isViewMode && (
          <>
            <IconButton
              icon={<EditIcon boxSize={5} />}
              aria-label="Editar materias"
              mr={2}
              backgroundColor="white"
              _hover={{ backgroundColor: "#318AE4", color: "white" }}
              onClick={() => loadSubjectsAndOpen(career, "edit")}
            />

            {role === 1 ? (
              <IconButton
                icon={<DeleteIcon boxSize={5} />}
                aria-label="Eliminar carrera"
                mr={2}
                backgroundColor="white"
                _hover={{ backgroundColor: "#E53E3E", color: "white" }}
                onClick={() => handleDeleteCareer(career)}
              />
            ) : null}
          </>
        )}
      </Td>
    </Tr>
  );

  return (
    <>
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
                compact={false}
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

      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={closeSubjectModal}
        onConfirm={canEditSubjects ? handleConfirmEditSubjects : undefined}
        entityName="Materias"
        titleCareer={selectedCareer?.name}
        subjects={subjects}
        renderSubjectNow={
          canEditSubjects ? renderSubjectNow : renderSubjectNowView
        }
        showButtonCancelSave={canEditSubjects}
      />
    </>
  );
};

export default CareerModalEdit;
