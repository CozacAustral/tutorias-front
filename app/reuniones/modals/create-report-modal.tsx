// src/pages/reuniones/modals/create-report-modal.tsx
"use client";

import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  FormControl, FormLabel, Input, Textarea, Button, HStack, useToast, SkeletonText, Skeleton,
  AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody,
  AlertDialogFooter, Select,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { UserService } from "../../../services/admin-service";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  meetingId: number | null;
  studentId: number | null; // 👈 nuevo
  onCreated?: () => void;
};

type CreateReportDto = {
  topicos: string;
  comments?: string;
  careerId?: number; // 👈 ahora lo enviamos cuando haya múltiples
};

// tipado defensivo para distintas formas de “careers” en Student
type AnyStudent = {
  id: number;
  careers?:
    | Array<{ id?: number; name?: string; yearOfAdmission?: number; active?: boolean; careerId?: number; career?: { id?: number; name?: string } }>
    | undefined;
  assignedCareers?:
    | Array<{ careerId?: number; yearOfAdmission?: number; active?: boolean; career?: { id?: number; name?: string } }>
    | undefined;
  studentCareers?:
    | Array<{ careerId?: number; yearOfAdmission?: number; active?: boolean; career?: { id?: number; name?: string } }>
    | undefined;
};

type UiCareer = { id: number; name: string; yearOfAdmission: number; active: boolean };

function extractActiveCareers(student: AnyStudent | null | undefined): UiCareer[] {
  if (!student) return [];
  const sources =
    student.careers ??
    student.assignedCareers ??
    student.studentCareers ??
    [];

  return (sources as any[]).map((c) => {
    const id = c.careerId ?? c.id ?? c?.career?.id;
    const name = c?.career?.name ?? c.name ?? "Carrera";
    const yoa = c.yearOfAdmission ?? 0;
    const active = c.active !== false; // por defecto true
    return { id: Number(id), name: String(name), yearOfAdmission: Number(yoa), active } as UiCareer;
  }).filter(x => !!x.id && x.active);
}

const CreateReportModal: React.FC<Props> = ({ isOpen, onClose, meetingId, studentId, onCreated }) => {
  const toast = useToast();
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

    // 🔸 estrategia sin tocar back: usar /students/:id si lo tenemos
    const fetchCareers = async () => {
      try {
        if (studentId) {
          const student = (await UserService.fetchStudentById(studentId)) as unknown as AnyStudent;
          const actives = extractActiveCareers(student);
          setActiveCareers(actives);
          if (actives.length === 1) setSelectedCareerId(actives[0].id);
        } else {
          // fallback: mantener compat con endpoint actual (si trae una sola carrera "implícita")
          const res = await UserService.getReportInfo(meetingId);

          if ((res as any)?.careerName) {
            setActiveCareers([{
              id: -1, // back no nos da id → evitar que el select falle
              name: (res as any).careerName ?? "—",
              yearOfAdmission: Number((res as any).yearOfAdmission ?? 0),
              active: true,
            }]);
            setSelectedCareerId("");
          }
        }
      } catch (e: any) {
        toast({
          title: "No se pudo obtener datos de la(s) carrera(s)",
          description: e?.message ?? "",
          status: "warning",
        });
      } finally {
        setLoadingInfo(false);
      }
    };

    void fetchCareers();
  }, [isOpen, meetingId, studentId]); // eslint-disable-line react-hooks/exhaustive-deps

  const openConfirm = () => {
    if (!meetingId) return;

    if (!topicos.trim()) {
      toast({ title: "Faltan datos", description: "Ingresá los temas tratados.", status: "error" });
      return;
    }
    if (activeCareers.length > 1 && !selectedCareerId) {
      toast({ title: "Seleccioná una carrera", description: "El alumno tiene múltiples carreras activas.", status: "error" });
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleCreate = async () => {
    if (!meetingId) return;
    setSubmitting(true);

    // Si hay múltiples activas, mandamos la elegida; si hay 1 y vino con id válido, también.
    const chosenId =
      activeCareers.length >= 1
        ? Number(selectedCareerId) || (activeCareers[0]?.id > 0 ? activeCareers[0].id : undefined)
        : undefined;

    const dto: CreateReportDto = {
      topicos: topicos.trim(),
      comments: comments.trim() ? comments.trim() : undefined,
      careerId: chosenId, // puede ser undefined si no hay info confiable
    };

    try {
      await UserService.createReport(meetingId, dto);
      toast({ title: "Reporte creado", status: "success" });
      setIsConfirmOpen(false);
      onClose();
      onCreated?.();
    } catch (e: any) {
      toast({ title: "Error al crear reporte", description: e?.message ?? "", status: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const single = activeCareers.length === 1 ? activeCareers[0] : null;

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
            ) : activeCareers.length <= 1 ? (
              <HStack spacing={4}>
                <FormControl isDisabled>
                  <FormLabel>Carrera</FormLabel>
                  <Input value={single ? single.name : "—"} readOnly />
                </FormControl>
                <FormControl isDisabled>
                  <FormLabel>Año de ingreso</FormLabel>
                  <Input value={single?.yearOfAdmission ? String(single.yearOfAdmission) : "—"} readOnly />
                </FormControl>
              </HStack>
            ) : (
              <HStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Carrera (múltiples activas)</FormLabel>
                  <Select
                    placeholder="Seleccioná una carrera"
                    value={selectedCareerId}
                    onChange={(e) => setSelectedCareerId(Number(e.target.value))}
                    isDisabled={submitting}
                  >
                    {activeCareers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} — Ingreso {c.yearOfAdmission}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>
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

      <AlertDialog isOpen={isConfirmOpen} leastDestructiveRef={cancelRef} onClose={() => setIsConfirmOpen(false)} isCentered>
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
