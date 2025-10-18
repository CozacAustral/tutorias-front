// src/pages/reuniones/modals/create-report-modal.tsx
"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  HStack,
  useToast,
  SkeletonText,
  Skeleton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { UserService } from "../../../services/admin-service";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  meetingId: number | null;
  onCreated?: () => void;
};

type ReportInfo = {
  careerName: string;
  yearOfAdmission: number;
};

type CreateReportDto = {
  topicos: string;
  comments?: string;
};

const CreateReportModal: React.FC<Props> = ({ isOpen, onClose, meetingId, onCreated }) => {
  const toast = useToast();
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState<ReportInfo | null>(null);

  const [topicos, setTopicos] = useState("");
  const [comments, setComments] = useState("");

  // Confirmación
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen || !meetingId) return;
    setTopicos("");
    setComments("");
    setInfo(null);
    setLoadingInfo(true);
    UserService.getReportInfo(meetingId)
      .then((res) => {
        setInfo({
          careerName: res?.careerName ?? "—",
          yearOfAdmission: res?.yearOfAdmission ?? 0,
        });
      })
      .catch((e: any) => {
        toast({
          title: "No se pudo obtener datos de la carrera",
          description: e?.message ?? "",
          status: "warning",
        });
      })
      .finally(() => setLoadingInfo(false));
  }, [isOpen, meetingId]); // eslint-disable-line react-hooks/exhaustive-deps

  const openConfirm = () => {
    if (!meetingId) return;
    if (!topicos.trim()) {
      toast({ title: "Faltan datos", description: "Ingresá los temas tratados.", status: "error" });
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleCreate = async () => {
    if (!meetingId) return;
    setSubmitting(true);
    const dto: CreateReportDto = {
      topicos: topicos.trim(),
      comments: comments.trim() ? comments.trim() : undefined,
    };
    try {
      await UserService.createReport(meetingId, dto);
      toast({ title: "Reporte creado", status: "success" });
      setIsConfirmOpen(false);
      onClose();
      onCreated?.();
    } catch (e: any) {
      toast({
        title: "Error al crear reporte",
        description: e?.message ?? "",
        status: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nuevo reporte</ModalHeader>
          <ModalCloseButton isDisabled={submitting} />
          <ModalBody pb={4}>
            <HStack spacing={4}>
              <FormControl isDisabled>
                <FormLabel>Carrera</FormLabel>
                {loadingInfo ? <Skeleton height="38px" /> : <Input value={info?.careerName ?? "—"} readOnly />}
              </FormControl>
              <FormControl isDisabled>
                <FormLabel>Año de ingreso</FormLabel>
                {loadingInfo ? (
                  <Skeleton height="38px" />
                ) : (
                  <Input value={info?.yearOfAdmission ? String(info.yearOfAdmission) : "—"} readOnly />
                )}
              </FormControl>
            </HStack>

            <FormControl mt={4} isRequired>
              <FormLabel>Temas tratados</FormLabel>
              <Textarea
                value={topicos}
                onChange={(e) => setTopicos(e.target.value)}
                placeholder="Descripción de los tópicos vistos en la reunión"
                rows={5}
                isDisabled={submitting}
              />
              {loadingInfo && <SkeletonText mt="3" noOfLines={2} spacing="2" />}
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
            <Button variant="ghost" mr={3} onClick={onClose} isDisabled={submitting}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={openConfirm} isLoading={submitting}>
              Guardar reporte
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirmación antes de enviar */}
      <AlertDialog
        isOpen={isConfirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsConfirmOpen(false)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar creación de reporte
            </AlertDialogHeader>

            <AlertDialogBody>
              Esta acción es <b>permanente</b>. Una vez creado, el reporte no podrá editarse.
              ¿Deseás confirmar el envío?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsConfirmOpen(false)}>
                Cancelar
              </Button>
              <Button colorScheme="blue" onClick={handleCreate} ml={3} isLoading={submitting}>
                Confirmar y enviar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default CreateReportModal;
