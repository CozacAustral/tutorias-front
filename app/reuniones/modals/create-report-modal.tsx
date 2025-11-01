// src/pages/reuniones/modals/create-report-modal.tsx
"use client";

import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Skeleton,
  SkeletonText,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { UserService } from "../../../services/admin-service";
import { AnyStudent } from "./type/any-student.type";
import { UiCareer } from "./type/ui-career.type";
import { CreateReportDto } from "../dto/create-report.dto";
import ConfirmDialog from './confirm-dialog-modal';


export type CreateReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  meetingId: number | null;
  studentId: number | null;
  onCreated?: () => void;
};

function extractActiveCareers(student: AnyStudent | null | undefined): UiCareer[] {
  if (!student) return [];
  const sources =
    student.careers ?? student.assignedCareers ?? student.studentCareers ?? [];
  return (sources as any[])
    .map((c) => {
      const id = c.careerId ?? c.id ?? c?.career?.id;
      const name = c?.career?.name ?? c.name ?? "Carrera";
      const yoa = c.yearOfAdmission ?? 0;
      const active = c.active !== false;
      return {
        id: Number(id),
        name: String(name),
        yearOfAdmission: Number(yoa),
        active,
      } as UiCareer;
    })
    .filter((x) => !!x.id && x.active);
}

const CreateReportModal: React.FC<CreateReportModalProps> = ({
  isOpen,
  onClose,
  meetingId,
  studentId,
  onCreated,
}) => {
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [activeCareers, setActiveCareers] = useState<UiCareer[]>([]);
  const [selectedCareerId, setSelectedCareerId] = useState<number | "">("");

  const [topicos, setTopicos] = useState("");
  const [comments, setComments] = useState("");

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen || !meetingId) return;

    setTopicos("");
    setComments("");
    setActiveCareers([]);
    setSelectedCareerId("");
    setLoadingInfo(true);

    const fetchCareers = async () => {
      try {
        if (studentId) {
          const actives = await UserService.getStudentCareers(studentId);
          setActiveCareers(actives ?? []);
          if ((actives ?? []).length >= 1) setSelectedCareerId(actives[0].id);
        } else {
          const res = await UserService.getReportInfo(meetingId);
          if (res?.careerName) {
            const only = {
              id: -1,
              name: res.careerName,
              yearOfAdmission: Number(res.yearOfAdmission ?? 0),
              active: true,
            };
            setActiveCareers([only]);
            setSelectedCareerId(only.id);
          }
        }
      } catch (e: any) {
      } finally {
        setLoadingInfo(false);
      }
    };

    void fetchCareers();
  }, [isOpen, meetingId, studentId]);

  const openConfirm = () => {
    if (!meetingId) return;

    if (!topicos.trim()) {
      return;
    }
    if (activeCareers.length >= 1 && !selectedCareerId) {
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleCreate = async () => {
    if (!meetingId) return;
    setSubmitting(true);

    const sel = Number(selectedCareerId);
    const chosenId = sel > 0 ? sel : undefined;

    const dto: CreateReportDto = {
      topicos: topicos.trim(),
      comments: comments.trim() ? comments.trim() : undefined,
      careerId: chosenId,
    };

    try {
      await UserService.createReport(meetingId, dto);
      setIsConfirmOpen(false);
      onClose();
      onCreated?.();
    } catch (e: any) {
    } finally {
      setSubmitting(false);
    }
  };

  const selected =
    activeCareers.find((c) => c.id === Number(selectedCareerId)) || null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nuevo reporte</ModalHeader>
          <ModalCloseButton isDisabled={submitting} />
          <ModalBody pb={4}>
            {loadingInfo ? (
              <HStack spacing={4}>
                <Skeleton height="38px" flex={1} />
                <Skeleton height="38px" flex={1} />
              </HStack>
            ) : (
              <>
                <HStack spacing={4}>
                  <FormControl isRequired={activeCareers.length >= 1}>
                    <FormLabel>Carrera</FormLabel>
                    <Select
                      placeholder={
                        activeCareers.length
                          ? "Seleccioná una carrera"
                          : "Sin carreras activas"
                      }
                      value={selectedCareerId}
                      onChange={(e) =>
                        setSelectedCareerId(Number(e.target.value))
                      }
                      isDisabled={submitting || !activeCareers.length}
                    >
                      {activeCareers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isDisabled>
                    <FormLabel>Año de ingreso</FormLabel>
                    <Input
                      value={
                        selected?.yearOfAdmission
                          ? String(selected.yearOfAdmission)
                          : "—"
                      }
                      readOnly
                    />
                  </FormControl>
                </HStack>
              </>
            )}

            <FormControl mt={4} isRequired>
              <FormLabel>Temas tratados</FormLabel>
              <Textarea
                value={topicos}
                onChange={(e) => setTopicos(e.target.value)}
                placeholder="Descripción de los tópicos vistos en la reunión"
                rows={5}
                isDisabled={submitting}
              />
              {loadingInfo && (
                <SkeletonText mt="3" noOfLines={2} spacing="2" />
              )}
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Comentarios</FormLabel>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Observaciones adicionales (opcional)"
                rows={4}
                isDisabled={submitting}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={onClose}
              isDisabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              onClick={openConfirm}
              isLoading={submitting}
            >
              Guardar reporte
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleCreate}
        isLoading={submitting}
        leastDestructiveRef={cancelRef}
        title="Confirmar creación de reporte"
        body={
          <>
            Esta acción es <b>permanente</b>. Una vez creado, el reporte no podrá
            editarse. ¿Deseás confirmar el envío?
          </>
        }
        confirmText="Confirmar y enviar"
        cancelText="Cancelar"
        confirmColorScheme="blue"
      />
    </>
  );
};

export default CreateReportModal;
