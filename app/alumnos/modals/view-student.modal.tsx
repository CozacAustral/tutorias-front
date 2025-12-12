"use client";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaGraduationCap } from "react-icons/fa";
import { UserService } from "../../../services/admin-service";
import { StudentCareer } from "../interfaces/student-career.interface";
import { SubjectCareerWithState } from "../interfaces/subject-career-student.interface";
import CareerModalEdit from "./rendercareer-modal.modal";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => Promise<void> | void;
  formData: any;
  onInputChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onViewSubjects?: (career: StudentCareer) => void;
  onEditSubjects?: (career: StudentCareer) => void;
  onDeleteCareer?: (career: StudentCareer) => void;
  onToggleActive?: (career: StudentCareer) => void;
  isViewMode?: boolean;
  role?: number;
  renderSubjectRow?: (
    subject: SubjectCareerWithState,
    index: number
  ) => React.ReactNode;
  renderSubjectNow?: (
    subject: SubjectCareerWithState,
    index: number
  ) => React.ReactNode;
}

const StudentModal: React.FC<StudentModalProps> = ({
    renderSubjectNow,
  isOpen,
  onClose,
  onConfirm,
  formData,
  onInputChange,
  onViewSubjects,
  onEditSubjects,
  onDeleteCareer,
  onToggleActive,
  isViewMode = false,
  role = 0,
}) => {
  const [showObservations, setShowObservations] = useState(false);

  const {
    isOpen: isCareersModalOpen,
    onOpen: openCareersModal,
    onClose: closeCareersModal,
  } = useDisclosure();

  const toggleBlur = () => setShowObservations((prev) => !prev);

  const handleViewSubjects = async (
    career: StudentCareer
  ): Promise<SubjectCareerWithState[]> => {
    try {
      // ✅ Aseguramos que el ID del alumno sea correcto
      const studentId = formData?.id || formData?.studentId;

      if (!studentId || !career.careerId) {
        console.error("Faltan IDs:", { studentId, careerId: career.careerId });
        return [];
      }

      const res = await UserService.fetchStudentSubject(
        studentId,
        career.careerId
      );
      return res ?? [];
    } catch (error) {
      console.error("Error al cargar materias:", error);

      return [];
    }
  };

  const careerDisplay = () => {
    const careers: StudentCareer[] = formData?.careers || [];
    if (careers.length === 0) return "Sin carrera asignada";
    if (isViewMode && careers.length > 1)
      return (
        careers
          .map((c: StudentCareer) => c.name)
          .join(", ")
          .slice(0, 25) + "..."
      );
    return careers.map((c: StudentCareer) => c.name).join(", ");
  };

  return (
    <>
      {/* Modal principal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent maxW="52vw">
          <ModalHeader fontSize="2xl" fontWeight="bold">
            {isViewMode ? "Ver Alumno" : "Editar Alumno"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              {/* Nombre / Apellido */}
              <HStack spacing={4} w="100%">
                <FormControl>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    name="name"
                    type="text"
                    borderColor="light_gray"
                    bg="light_gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={formData.name || ""}
                    onChange={isViewMode ? undefined : onInputChange}
                    isReadOnly={isViewMode}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Apellido/s</FormLabel>
                  <Input
                    name="lastName"
                    type="text"
                    borderColor="light_gray"
                    bg="light_gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={formData.lastName || ""}
                    onChange={isViewMode ? undefined : onInputChange}
                    isReadOnly={isViewMode}
                  />
                </FormControl>
              </HStack>

              {/* Email / Teléfono */}
              <HStack spacing={4} w="100%">
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    borderColor="light_gray"
                    bg="light_gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={formData.email || ""}
                    onChange={isViewMode ? undefined : onInputChange}
                    isReadOnly={isViewMode}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Teléfono</FormLabel>
                  <Input
                    name="telephone"
                    type="tel"
                    borderColor="light_gray"
                    bg="light_gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={formData.telephone || ""}
                    onChange={isViewMode ? undefined : onInputChange}
                    isReadOnly={isViewMode}
                  />
                </FormControl>
              </HStack>

              {/* DNI / Dirección */}
              <HStack spacing={4} w="100%">
                <FormControl>
                  <FormLabel>DNI</FormLabel>
                  <Input
                    name="dni"
                    type="text"
                    borderColor="light_gray"
                    bg="light_gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={formData.dni || ""}
                    onChange={isViewMode ? undefined : onInputChange}
                    isReadOnly={isViewMode}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Dirección</FormLabel>
                  <Input
                    name="address"
                    type="text"
                    borderColor="light_gray"
                    bg="light_gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={formData.address || ""}
                    onChange={isViewMode ? undefined : onInputChange}
                    isReadOnly={isViewMode}
                  />
                </FormControl>
              </HStack>

              {/* País / Carrera */}
              <HStack spacing={4} w="100%">
                <FormControl>
                  <FormLabel>País</FormLabel>
                  <Input
                    name="countryId"
                    type="text"
                    borderColor="light_gray"
                    bg="light_gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={formData.countryId || ""}
                    onChange={isViewMode ? undefined : onInputChange}
                    isReadOnly={isViewMode}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Carrera/s</FormLabel>
                  <InputGroup>
                    <Input
                      name="career"
                      type="text"
                      borderColor="light_gray"
                      bg="light_gray"
                      borderWidth="4px"
                      borderRadius="15px"
                      w="100%"
                      h="50px"
                      value={careerDisplay()}
                      isReadOnly
                    />
                    <InputRightElement
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mt="4px"
                    >
                      <IconButton
                        icon={<FaGraduationCap size={22} />}
                        aria-label="Ver carreras"
                        onClick={openCareersModal}
                        bg="transparent"
                        size="sm"
                        borderRadius="full"
                        _hover={{ bg: "primary", color: "white" }}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </HStack>

              {/* Observaciones */}
              <FormControl>
                <FormLabel>Observaciones</FormLabel>
                <InputGroup>
                  <Textarea
                    name="observations"
                    borderColor="light_gray"
                    bg="light_gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="100px"
                    value={formData.observations || ""}
                    onChange={isViewMode ? undefined : onInputChange}
                    isReadOnly={isViewMode}
                    style={{
                      filter: showObservations ? "none" : "blur(4px)",
                      transition: "filter 0.2s ease",
                    }}
                  />
                  <InputRightElement h="100%" alignItems="flex-start" pt={2}>
                    <IconButton
                      icon={showObservations ? <ViewOffIcon /> : <ViewIcon />}
                      aria-label="Toggle Observaciones"
                      onClick={toggleBlur}
                      variant="ghost"
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            {isViewMode ? (
              <Button bg="primary" color="white" onClick={onClose}>
                Volver
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={onClose} mr={4}>
                  Cancelar
                </Button>
                <Button bg="primary" color="white" onClick={onConfirm}>
                  Guardar
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
      <CareerModalEdit
        isOpen={isCareersModalOpen}
        onClose={closeCareersModal}
        careers={formData.careers || []}
        onViewSubjects={handleViewSubjects} // ✅ cambia acá
        onEditSubjects={onEditSubjects}
        onDeleteCareer={onDeleteCareer}
        onToggleActive={onToggleActive}
        isViewMode={isViewMode}
        role={role}
      renderSubjectNow={renderSubjectNow}
      />
    </>
  );
};

export default StudentModal;
