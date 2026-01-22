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
  Skeleton,
  SkeletonText,
  Textarea,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  toastError,
  toastSuccess,
} from "../../../common/feedback/toast-standalone";
import { UserService } from "../../../services/admin-service";
import { Report } from "./type/report.type";

type Props = {
  onDeleted?: () => void;
  isOpen: boolean;
  onClose: () => void;
  meetingId: number | null;
  studentId?: number | null;
  onOpenSubjects: (args: {
    studentId: number | null;
    careerId: number | undefined;
    careerName: string | undefined;
  }) => void;
};

const ViewReportModal: React.FC<Props> = ({
  onDeleted,
  isOpen,
  onClose,
  meetingId,
  studentId = null,
  onOpenSubjects,
}) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [sendingReport, setSendingReport] = useState(false);

  const loadReport = useCallback(async () => {
    if (!meetingId) return;
    setLoading(true);
    setReport(null);

    try {
      const res = await UserService.getReport(meetingId);
      setReport(res as any);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [meetingId]);

  useEffect(() => {
    if (isOpen) {
      loadReport();
    }
  }, [isOpen, loadReport]);

  const careerName = useMemo(
    () => report?.career?.name ?? "—",
    [report?.career?.name]
  );

  const admissionYear = useMemo(
    () => (report?.yearOfAdmission ? String(report.yearOfAdmission) : "—"),
    [report?.yearOfAdmission]
  );

  const topicsValue = useMemo(() => report?.topicos ?? "", [report?.topicos]);

  const commentsValue = useMemo(
    () => report?.comments ?? "",
    [report?.comments]
  );

  const handleOpenSubjectsClick = useCallback(() => {
    onOpenSubjects({
      studentId: studentId ?? null,
      careerId: report?.career?.id,
      careerName: report?.career?.name,
    });
  }, [onOpenSubjects, studentId, report?.career?.id, report?.career?.name]);

  const handleSendReport = useCallback(async () => {
    if (!meetingId) return;

    try {
      setSendingReport(true);
      await UserService.sendReportToStudent(meetingId);

      toastSuccess({
        title: "Reporte enviado al alumno",
        description:
          "El reporte ha sido enviado correctamente al correo del alumno.",
      });
    } catch (err) {
      toastError({
        title: "Error al enviar el reporte",
        description:
          "No se pudo enviar el reporte al alumno. Por favor, intentá nuevamente más tarde.",
      });
    } finally {
      setSendingReport(false);
    }
  }, [meetingId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reporte de reunión</ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={4}>
          <HStack spacing={4}>
            <FormControl isDisabled>
              <FormLabel>Carrera</FormLabel>
              {loading ? (
                <Skeleton height="38px" />
              ) : (
                <Input value={careerName} readOnly />
              )}
            </FormControl>

            <FormControl isDisabled>
              <FormLabel>Año de ingreso</FormLabel>
              {loading ? (
                <Skeleton height="38px" />
              ) : (
                <Input value={admissionYear} readOnly />
              )}
            </FormControl>
          </HStack>

          <FormControl mt={4} isDisabled>
            <FormLabel>Temas tratados</FormLabel>
            {loading ? (
              <SkeletonText mt="3" noOfLines={5} spacing="2" />
            ) : (
              <Textarea rows={5} value={topicsValue} readOnly />
            )}
          </FormControl>

          <FormControl mt={4} isDisabled>
            <FormLabel>Comentarios</FormLabel>
            {loading ? (
              <SkeletonText mt="3" noOfLines={3} spacing="2" />
            ) : (
              <Textarea rows={4} value={commentsValue} readOnly />
            )}
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

          <Button variant="ghost" mr={3} onClick={onClose}>
            Cerrar
          </Button>

          <Button
            colorScheme="blue"
            onClick={handleSendReport}
            isLoading={sendingReport}
            isDisabled={submitting}
          >
            Enviar reporte
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewReportModal;
