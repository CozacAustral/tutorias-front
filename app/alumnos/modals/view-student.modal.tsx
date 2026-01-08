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
  Select,
  Textarea,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaGraduationCap } from "react-icons/fa";
import { UserService } from "../../../services/admin-service";
import { Country } from "../interfaces/country.interface";
import { StudentCareer } from "../interfaces/student-career.interface";
import { SubjectCareerWithState } from "../interfaces/subject-career-student.interface";
import CareerModalEdit from "./career-modal-edit.modal";

interface StudentModalProps {
  countries?: Country[];
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
  onConfirmEditSubject?: () => Promise<void> | void;
  renderSubjectNowView?: (
    subject: SubjectCareerWithState,
    index: number
  ) => React.ReactNode;
  onAddCareer?: () => void;
}

const StudentModal: React.FC<StudentModalProps> = ({
  onAddCareer,
  countries,
  renderSubjectNow,
  isOpen,
  onClose,
  onConfirm,
  formData,
  onInputChange,
  onDeleteCareer,
  onToggleActive,
  isViewMode = false,
  role = 0,
  onConfirmEditSubject,
  renderSubjectNowView,
}) => {
  const [showObservations, setShowObservations] = useState(false);

  const {
    isOpen: isCareersModalOpen,
    onOpen: openCareersModal,
    onClose: closeCareersModal,
  } = useDisclosure();

  const toggleBlur = () => setShowObservations((prev) => !prev);

  const countryName =
    countries?.find((c) => c.id === Number(formData.countryId))?.name ?? "";

  const handleViewSubjects = async (
    career: StudentCareer
  ): Promise<SubjectCareerWithState[]> => {
    try {
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

  const getCareerNames = () => {
    const careersAny = Array.isArray((formData as any)?.careers)
      ? (formData as any).careers
      : [];

    return careersAny
      .map((c: any) => c?.name ?? c?.career?.name ?? c?.name_career)
      .filter(Boolean) as string[];
  };

  const careerText = () => {
    const names = getCareerNames();

    const full = names.length === 0 ? "Sin carrera asignada" : names.join(", ");

    const display =
      names.length <= 1 ? full : `${names[0]} +${names.length - 1}...`;

    return { full, display };
  };

  const baseFieldProps = {
    borderWidth: "4px",
    borderRadius: "15px",
    w: "100%",
    h: "50px",
  } as const;

  const viewFieldProps = isViewMode
    ? ({
        bg: "gray.100",
        borderColor: "gray.200",
        color: "gray.600",
        _hover: { borderColor: "gray.200" },
        _focus: { boxShadow: "none", borderColor: "gray.200" },
        cursor: "not-allowed",
      } as const)
    : ({
        borderColor: "light_gray",
        bg: "light_gray",
      } as const);

  const hasObservations =
    typeof formData?.observations === "string" &&
    formData.observations.trim().length > 0;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent maxW="52vw">
          <ModalHeader fontSize="2xl" fontWeight="bold">
            {isViewMode ? "Ver Alumno" : "Editar Alumno"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <HStack spacing={4} w="100%">
                <FormControl>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    name="name"
                    type="text"
                    {...baseFieldProps}
                    {...viewFieldProps}
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
                    {...baseFieldProps}
                    {...viewFieldProps}
                    value={formData.lastName || ""}
                    onChange={isViewMode ? undefined : onInputChange}
                    isReadOnly={isViewMode}
                  />
                </FormControl>
              </HStack>

              <HStack spacing={4} w="100%">
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    {...baseFieldProps}
                    {...viewFieldProps}
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
                    {...baseFieldProps}
                    {...viewFieldProps}
                    value={formData.telephone || ""}
                    onChange={isViewMode ? undefined : onInputChange}
                    isReadOnly={isViewMode}
                  />
                </FormControl>
              </HStack>

              <HStack spacing={4} w="100%">
                <FormControl>
                  <FormLabel>DNI</FormLabel>
                  <Input
                    name="dni"
                    type="text"
                    {...baseFieldProps}
                    {...viewFieldProps}
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
                    {...baseFieldProps}
                    {...viewFieldProps}
                    value={formData.address || ""}
                    onChange={isViewMode ? undefined : onInputChange}
                    isReadOnly={isViewMode}
                  />
                </FormControl>
              </HStack>

              <HStack spacing={4} w="100%">
                <FormControl>
                  <FormLabel>País</FormLabel>

                  {isViewMode ? (
                    <Input
                      name="countryId"
                      type="text"
                      {...baseFieldProps}
                      {...viewFieldProps}
                      value={countryName}
                      isReadOnly
                    />
                  ) : (
                    <Select
                      name="countryId"
                      {...baseFieldProps}
                      {...viewFieldProps}
                      value={String(formData.countryId ?? "")}
                      onChange={onInputChange}
                      placeholder="Seleccionar país"
                    >
                      {(countries ?? []).map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </Select>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>Carrera/s</FormLabel>
                  <InputGroup>
                    {(() => {
                      const { full, display } = careerText();
                      return (
                        <Input
                          name="career"
                          type="text"
                          {...baseFieldProps}
                          {...viewFieldProps}
                          value={display}
                          title={full} // hover para ver todo
                          isReadOnly
                        />
                      );
                    })()}
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

              {hasObservations && (
                <FormControl>
                  <FormLabel>Observaciones</FormLabel>
                  <InputGroup>
                    <Textarea
                      name="observations"
                      borderWidth="4px"
                      borderRadius="15px"
                      w="100%"
                      h="100px"
                      {...(isViewMode
                        ? {
                            bg: "gray.100",
                            borderColor: "gray.200",
                            color: "gray.600",
                            cursor: "not-allowed",
                            _hover: { borderColor: "gray.200" },
                            _focus: {
                              boxShadow: "none",
                              borderColor: "gray.200",
                            },
                          }
                        : {
                            borderColor: "light_gray",
                            bg: "light_gray",
                          })}
                      value={formData.observations}
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
              )}
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
        onAddCareer={onAddCareer}
        isOpen={isCareersModalOpen}
        onClose={closeCareersModal}
        careers={formData.careers || []}
        onViewSubjects={handleViewSubjects}
        renderSubjectNowView={renderSubjectNowView}
        onDeleteCareer={onDeleteCareer}
        onToggleActive={onToggleActive}
        isViewMode={isViewMode}
        role={role}
        renderSubjectNow={renderSubjectNow}
        onConfirmEditSubject={onConfirmEditSubject}
      />
    </>
  );
};

export default StudentModal;
