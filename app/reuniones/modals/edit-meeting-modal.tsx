"use client";

import { useEffect, useState } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalCloseButton, ModalFooter, Button, FormControl, FormLabel,
  Input, VStack, HStack, Text,
} from "@chakra-ui/react";
import { UserService } from "../../../services/admin-service";
import { Props } from "../type/edit-props.type";

export default function EditMeetingModal({ isOpen, onClose, meeting, onUpdated }: Props) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const reset = () => {
    setDate("");
    setTime("");
    setLocation("");
  };

  useEffect(() => {
    if (!meeting) return;
    const [d, h] = (meeting.fechaHora || "").split(" ");
    const [dd, mm, yyyy] = (d || "").split("/");
    const iso = yyyy && mm && dd ? `${yyyy}-${mm.padStart(2,"0")}-${dd.padStart(2,"0")}` : "";
    setDate(iso);
    setTime((h || "").slice(0, 5));
    setLocation(meeting.aula || "");
  }, [meeting]);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen]);

  function toIsoUtcNoon(dateStr: string) {
  // dateStr: "YYYY-MM-DD"
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  return dt.toISOString();
}


const onSave = async () => {
  if (!meeting) return;

  const timeNorm =
    /^\d{1,2}:\d{2}(:\d{2})?$/.test(time) ? (time.length === 5 ? `${time}:00` : time) : `${time}:00`;

  try {
    await UserService.updateMeeting(meeting.id, {
      date: toIsoUtcNoon(date),  
      time: timeNorm,
      location,
    });
    onUpdated?.();
    onClose();
    reset();
  } catch (e: any) {
  }
};

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { onClose(); reset(); }}
      size="lg"
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar reunión</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <FormControl>
              <FormLabel>Alumno</FormLabel>
              <Text fontWeight="medium">{meeting?.alumno ?? "-"}</Text>
            </FormControl>

            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Fecha</FormLabel>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Hora</FormLabel>
                <Input
                  type="time"
                  step="60"
                  value={time}
                  onChange={(e) => setTime(e.target.value.slice(0, 5))}
                />
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel>Aula / Lugar</FormLabel>
              <Input
                placeholder="Ej: Aula 103"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button variant="ghost" onClick={() => { onClose(); reset(); }}>Cancelar</Button>
            <Button colorScheme="blue" onClick={onSave}>Guardar</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
