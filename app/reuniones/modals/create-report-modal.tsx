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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toastSuccess } from "../../../common/feedback/toast-standalone";
import { UserService } from "../../../services/admin-service";
import { CreateReportDto } from "../dto/create-report.dto";
import { ReunionestoastMessages } from "../enums/toast-messages.enum";
import ConfirmDialog from "./confirm-dialog-modal";
import { Report } from "./type/report.type";
import { UiCareer } from "./type/ui-career.type";

export type CreateReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  meetingId: number | null;
  studentId: number | null;
  onCreated?: () => void;
  loadReport: () => Promise<void>;
  onOpenSubjects: (args: {
    studentId: number | null;
    careerId: number | undefined;
    careerName: string | undefined;
  }) => void;
  report: Report | null;
};

const CreateReportModal: React.FC<CreateReportModalProps> = ({
  isOpen,
  onClose,
  meetingId,
  studentId,
  onCreated,
  onOpenSubjects,
  loadReport,
  report,
}) => {
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [activeCareers, setActiveCareers] = useState<UiCareer[]>([]);
  const [selectedCareerId, setSelectedCareerId] = useState<string | number>("");

  const [topicos, setTopicos] = useState("");
  const [comments, setComments] = useState("");

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const [reportSaved, setReportSaved] = useState(false);

  const fetchCareers = useCallback(async () => {
    if (!meetingId) return;
    setLoadingInfo(true);
    setTopicos("");
    setComments("");
    setActiveCareers([]);
    setSelectedCareerId("");

    try {
      if (studentId) {
        const actives = await UserService.getStudentCareers(studentId);
        setActiveCareers(actives ?? []);
        if ((actives ?? []).length >= 1) setSelectedCareerId(actives[0].id);
      } else {
        const res = await UserService.getReportInfo(meetingId);
        if (res?.careerName) {
          const only: UiCareer = {
            id: `virtual-${meetingId}`,
            name: res.careerName,
            yearOfAdmission: Number(res.yearOfAdmission ?? 0),
            active: true,
          };
          setActiveCareers([only]);
          setSelectedCareerId(only.id);
        }
      }
    } finally {
      setLoadingInfo(false);
    }
  }, [meetingId, studentId]);

  useEffect(() => {
    if (isOpen && meetingId) {
      fetchCareers();
    }
  }, [isOpen, meetingId, fetchCareers]);

  const selectedCareer = useMemo(
    () =>
      activeCareers.find((c) => String(c.id) === String(selectedCareerId)) ??
      null,
    [activeCareers, selectedCareerId],
  );

  const openConfirm = useCallback(() => {
    if (!meetingId) return;
    if (!topicos.trim()) return;
    if (activeCareers.length >= 1 && !selectedCareerId) return;
    setIsConfirmOpen(true);
  }, [meetingId, topicos, activeCareers.length, selectedCareerId]);

  const handleOpenSubjectsClick = useCallback(() => {
    onOpenSubjects({
      studentId: studentId ?? null,
      careerId: report?.career?.id,
      careerName: report?.career?.name,
    });
  }, [onOpenSubjects, studentId, report?.career?.id, report?.career?.name]);

  const handleCreate = useCallback(async () => {
    if (!meetingId) return;
    setSubmitting(true);

    let chosenId: number | undefined;
    if (typeof selectedCareerId === "number" && selectedCareerId > 0) {
      chosenId = selectedCareerId;
    }

    const dto: CreateReportDto = {
      topicos: topicos.trim(),
      comments: comments.trim() || undefined,
      careerId: chosenId,
    };

    try {
      await UserService.createReport(meetingId, dto);
      setIsConfirmOpen(false);
      setReportSaved(true);

      toastSuccess({
        title: ReunionestoastMessages.CREATE_REPORT_SUCCESS_TITLE,
        description: ReunionestoastMessages.CREATE_REPORT_SUCCESS_DESC,
      });

      onCreated?.();
    } finally {
      setSubmitting(false);
    }
  }, [meetingId, selectedCareerId, topicos, comments, onClose, onCreated]);

  useEffect(() => {
    if (isOpen) {
      setReportSaved(false);
    }
  }, [isOpen, meetingId]);

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
                    onChange={(e) => {
                      const raw = e.target.value;
                      const parsed = Number(raw);
                      setSelectedCareerId(isNaN(parsed) ? raw : parsed);
                    }}
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
                      selectedCareer?.yearOfAdmission
                        ? String(selectedCareer.yearOfAdmission)
                        : "—"
                    }
                    readOnly
                  />
                </FormControl>
              </HStack>
            )}

            <FormControl mt={4} isRequired>
              <FormLabel>Temas tratados</FormLabel>
              <Textarea
                value={topicos}
                onChange={(e) => setTopicos(e.target.value)}
                rows={5}
                placeholder="Descripción de los tópicos tratados"
                isDisabled={submitting}
              />
              {loadingInfo && <SkeletonText mt="3" noOfLines={2} spacing="2" />}
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>acuerdos con el alumno</FormLabel>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                placeholder="Observaciones adicionales (opcional)"
                isDisabled={submitting}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={handleOpenSubjectsClick}
              isDisabled={!report?.career?.id || !studentId}
            >
              Materias
            </Button>
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
              isDisabled={reportSaved}
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
            Esta acción es <b>permanente</b>. Una vez creado, el reporte no
            podrá editarse. ¿Deseás continuar?
          </>
        }
        confirmText="Confirmar y crear"
        cancelText="Cancelar"
        confirmColorScheme="blue"
      />
    </>
  );
};

export default CreateReportModal;
