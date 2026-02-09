"use client";

import {
  Button,
  FormControl,
  FormErrorMessage,
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
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  toastError,
  toastSuccess,
} from "../../../common/feedback/toast-standalone";
import { UserService } from "../../../services/admin-service";
import { ReunionestoastMessages } from "../enums/toast-messages.enum";
import { Props } from "../type/props.type";
import { StudentOption } from "../type/student-option.type";

export default function ScheduleMeetingModal({
  isOpen,
  onClose,
  students,
  onCreated,
  defaultStudentId,
}: Props & { defaultStudentId?: number }) {
  const initialRef = useRef<HTMLInputElement | null>(null);
  const [studentId, setStudentId] = useState<number>(0);
  const [dateValue, setDateValue] = useState<string>("");
  const [timeValue, setTimeValue] = useState<string>("");
  const [locationValue, setLocationValue] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [localStudents, setLocalStudents] = useState<StudentOption[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const locationRegex = useMemo(
    () => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 .,_\-\/()#:]+$/,
    [],
  );
  const isLocationValid =
    locationValue.trim().length > 0 && locationRegex.test(locationValue.trim());

  const resetForm = () => {
    setStudentId(0);
    setDateValue("");
    setTimeValue("");
    setLocationValue("");
  };

  useEffect(() => {
    if (!isOpen) {
      setLocalStudents([]);
      resetForm();
      return;
    }

    const loadMyStudents = async () => {
      try {
        setLoadingStudents(true);

        const res = await UserService.getMyStudents(1, 500);
        const arr = res?.data?.data ?? [];

        const opts = arr.map((s: any) => ({
          id: s.id,
          label:
            `${s?.user?.name ?? ""} ${s?.user?.lastName ?? ""}`.trim() ||
            s?.user?.email ||
            `#${s.id}`,
        }));

        setLocalStudents(opts);

        if (
          defaultStudentId &&
          opts.some((o: StudentOption) => o.id === defaultStudentId)
        ) {
          setStudentId(defaultStudentId);
        } else {
          setStudentId(0);
        }
      } catch (e) {
        setLocalStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };

    void loadMyStudents();
  }, [isOpen, defaultStudentId, students]);

  const handleCreate = async () => {
    if (!studentId || !dateValue || !timeValue || !locationValue.trim()) return;
    if (!isLocationValid) return;

    const fullDate = `${dateValue}T${timeValue}:00`;

    const body = {
      studentId,
      date: fullDate,
      location: locationValue.trim(),
    };
    try {
      setLoading(true);
      const resp = await UserService.schedule(body);
      onCreated?.(resp);
      toastSuccess({
        title: ReunionestoastMessages.SCHEDULE_SUCCESS_TITLE,
        description: ReunionestoastMessages.SCHEDULE_SUCCESS_DESC,
      });
      onClose();
      resetForm();
    } catch (e) {
      console.error(e);
      toastError({
        title: ReunionestoastMessages.SCHEDULE_ERROR_TITLE,
        description: ReunionestoastMessages.SCHEDULE_ERROR_DESC,
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
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Agendar reunión</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Alumno</FormLabel>
            <Select
              ref={initialRef as any}
              placeholder={
                loadingStudents ? "Cargando..." : "Seleccionar alumno"
              }
              value={studentId || ""}
              onChange={(e) => setStudentId(Number(e.target.value))}
              isDisabled={loadingStudents}
            >
              {localStudents.map((s) => (
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

          <FormControl
            mt={4}
            isInvalid={locationValue.trim().length > 0 && !isLocationValid}
          >
            <FormLabel>Aula</FormLabel>
            <Input
              placeholder="A1 / B2 / etc."
              value={locationValue}
              onChange={(e) => setLocationValue(e.target.value)}
              maxLength={40}
            />
            <FormErrorMessage>
              Solo letras, números, espacios y . _ - /. Debe contener al menos
              un carácter alfanumérico.
            </FormErrorMessage>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            isLoading={loading}
            onClick={handleCreate}
            isDisabled={
              loading ||
              !studentId ||
              !dateValue ||
              !timeValue ||
              !locationValue.trim() ||
              !isLocationValid
            }
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
