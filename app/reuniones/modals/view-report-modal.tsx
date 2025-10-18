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
  Skeleton,
  SkeletonText,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { UserService } from "../../../services/admin-service";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  meetingId: number | null;
  onDeleted?: () => void; // callback opcional tras eliminar
};

type Report = {
  id: number;
  meetingId: number;
  topicos: string | null;
  comments: string | null;
  yearOfAdmission: number;
  career?: { id: number; name: string };
  meeting?: { date: string; time: string; location: string };
};

const ViewReportModal: React.FC<Props> = ({ isOpen, onClose, meetingId, onDeleted }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);

  // Confirmación de borrado
  const [confirmOpen, setConfirmOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen || !meetingId) return;
    setLoading(true);
    setReport(null);
    UserService.getReport(meetingId)
      .then((res) => setReport(res as any))
      .catch((e: any) => {
        toast({
          title: "No se pudo cargar el reporte",
          description: e?.message ?? "",
          status: "error",
        });
      })
      .finally(() => setLoading(false));
  }, [isOpen, meetingId]); // eslint-disable-line

  const handleDelete = async () => {
    if (!meetingId) return;
    try {
      await UserService.deleteReport(meetingId);
      toast({ title: "Reporte eliminado", status: "success" });
      setConfirmOpen(false);
      onClose();
      onDeleted?.();
    } catch (e: any) {
      toast({
        title: "Error al eliminar",
        description: e?.message ?? "",
        status: "error",
      });
    }
  };

  return (
    <>
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
                  <Input value={report?.career?.name ?? "—"} readOnly />
                )}
              </FormControl>
              <FormControl isDisabled>
                <FormLabel>Año de ingreso</FormLabel>
                {loading ? (
                  <Skeleton height="38px" />
                ) : (
                  <Input
                    value={
                      report?.yearOfAdmission ? String(report.yearOfAdmission) : "—"
                    }
                    readOnly
                  />
                )}
              </FormControl>
            </HStack>

            <FormControl mt={4} isDisabled>
              <FormLabel>Temas tratados</FormLabel>
              {loading ? (
                <SkeletonText mt="3" noOfLines={5} spacing="2" />
              ) : (
                <Textarea rows={5} value={report?.topicos ?? ""} readOnly />
              )}
            </FormControl>

            <FormControl mt={4} isDisabled>
              <FormLabel>Comentarios</FormLabel>
              {loading ? (
                <SkeletonText mt="3" noOfLines={3} spacing="2" />
              ) : (
                <Textarea rows={4} value={report?.comments ?? ""} readOnly />
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cerrar
            </Button>
            <Button colorScheme="red" onClick={() => setConfirmOpen(true)}>
              Eliminar reporte
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirmación de borrado */}
      <AlertDialog
        isOpen={confirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setConfirmOpen(false)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar reporte
            </AlertDialogHeader>
            <AlertDialogBody>
              ¿Seguro que querés eliminar este reporte? Podrás crear uno nuevo luego.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setConfirmOpen(false)}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ViewReportModal;
