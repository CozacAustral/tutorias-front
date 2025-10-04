// src/components/meetings/ScheduleMeetingModal.tsx
"use client";

import { Props } from '../type/props.type';
import { useRef, useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useToast,
} from "@chakra-ui/react";
import { CreateMeetingBody } from "../type/create-meeting-body.type";
import { UserService } from "../../../services/admin-service";

type StudentOption = { id: number; label: string };

export default function ScheduleMeetingModal({
  isOpen,
  onClose,
  students,
  onCreated,
}: Props) {
  const initialRef = useRef<HTMLInputElement | null>(null);
  const [studentId, setStudentId] = useState<number>(0);
  const [dateValue, setDateValue] = useState<string>("");
  const [timeValue, setTimeValue] = useState<string>("");
  const [locationValue, setLocationValue] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const resetForm = () => {
    setStudentId(0);
    setDateValue("");
    setTimeValue("");
    setLocationValue("");
  };

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  const handleCreate = async () => {
    if (!studentId || !dateValue || !timeValue || !locationValue) {
      toast({ status: "warning", title: "Completa todos los campos" });
      return;
    }
    const timeNorm = /^\d{1,2}:\d{2}(:\d{2})?$/.test(timeValue)
      ? timeValue.length === 5
        ? `${timeValue}:00`
        : timeValue
      : `${timeValue}:00`;

    const body: CreateMeetingBody = {
      studentId,
      date: dateValue,
      time: timeNorm,
      location: locationValue.trim(),
    };
    try {
      setLoading(true);
      const resp = await UserService.schedule(body);
      toast({ status: "success", title: "Reunión creada" });
      onCreated?.(resp);
      onClose();
      resetForm();
    } catch (e: any) {
      toast({
        status: "error",
        title: "No se pudo crear la reunión",
        description: e?.response?.data?.message ?? "Error inesperado",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        resetForm();
      }}
      size="xl"
      initialFocusRef={initialRef as any}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Agenda una reunión</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Alumno</FormLabel>
            <Select
              ref={initialRef as any}
              placeholder="Seleccionar alumno"
              value={studentId || ""}
              onChange={(e) => setStudentId(Number(e.target.value))}
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Fecha</FormLabel>
            <Input
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Hora</FormLabel>
            <Input
              type="time"
              value={timeValue}
              onChange={(e) => setTimeValue(e.target.value)}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Aula</FormLabel>
            <Input
              placeholder="A1 / B2 / etc."
              value={locationValue}
              onChange={(e) => setLocationValue(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            isLoading={loading}
            onClick={handleCreate}
          >
            Guardar
          </Button>
          <Button
            onClick={() => {
              onClose();
              resetForm();
            }}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
