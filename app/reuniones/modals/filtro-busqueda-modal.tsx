// app/reuniones/modals/filter-meetings-modal.tsx
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
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

export type Filters = {
  from?: string;
  to?: string;
  timeFrom?: string;
  timeTo?: string;
  studentId?: number;
  studentQuery?: string;
  status?: "all" | "upcoming" | "past";
  order?: "asc" | "desc";
};

type StudentOption = { id: number; label: string };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (f: Filters) => void;
  onClear: () => void;
  students: StudentOption[];
  current?: Filters;
};

export default function FilterMeetingsModal({
  isOpen,
  onClose,
  onApply,
  onClear,
  students,
  current,
}: Props) {
  const [local, setLocal] = useState<Filters>({
    status: "all",
    order: "asc",
  });

  useEffect(() => {
    setLocal({
      status: current?.status ?? "all",
      order: current?.order ?? "asc",
      from: current?.from ?? "",
      to: current?.to ?? "",
      timeFrom: current?.timeFrom ?? "",
      timeTo: current?.timeTo ?? "",
      studentId: current?.studentId,
      studentQuery: current?.studentQuery ?? "",
    });
  }, [current, isOpen]);

  const studentOptions = useMemo(
    () =>
      [{ id: 0, label: "Todos" }, ...students].filter(
        (s, idx, arr) => arr.findIndex((x) => x.id === s.id) === idx
      ),
    [students]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Filtros de búsqueda</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack>
              <FormControl>
                <FormLabel>Desde (fecha)</FormLabel>
                <Input
                  type="date"
                  value={local.from ?? ""}
                  onChange={(e) =>
                    setLocal((p) => ({ ...p, from: e.target.value }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Hasta (fecha)</FormLabel>
                <Input
                  type="date"
                  value={local.to ?? ""}
                  onChange={(e) =>
                    setLocal((p) => ({ ...p, to: e.target.value }))
                  }
                />
              </FormControl>
            </HStack>

            <HStack>
              <FormControl>
                <FormLabel>Hora desde</FormLabel>
                <Input
                  type="time"
                  value={local.timeFrom ?? ""}
                  onChange={(e) =>
                    setLocal((p) => ({ ...p, timeFrom: e.target.value }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Hora hasta</FormLabel>
                <Input
                  type="time"
                  value={local.timeTo ?? ""}
                  onChange={(e) =>
                    setLocal((p) => ({ ...p, timeTo: e.target.value }))
                  }
                />
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel>Alumno</FormLabel>
              <Select
                value={String(local.studentId ?? 0)}
                onChange={(e) =>
                  setLocal((p) => ({
                    ...p,
                    studentId: Number(e.target.value) || undefined,
                  }))
                }
              >
                {studentOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Buscar por nombre/apellido/email</FormLabel>
              <Input
                placeholder="Ej: Clark, Kent, ckent@mail..."
                value={local.studentQuery ?? ""}
                onChange={(e) =>
                  setLocal((p) => ({ ...p, studentQuery: e.target.value }))
                }
              />
            </FormControl>

            <HStack>
              <FormControl>
                <FormLabel>Estado</FormLabel>
                <Select
                  value={local.status ?? "all"}
                  onChange={(e) =>
                    setLocal((p) => ({
                      ...p,
                      status: e.target.value as Filters["status"],
                    }))
                  }
                >
                  <option value="all">Todos</option>
                  <option value="upcoming">Próximas</option>
                  <option value="past">Pasadas</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Orden</FormLabel>
                <Select
                  value={local.order ?? "asc"}
                  onChange={(e) =>
                    setLocal((p) => ({
                      ...p,
                      order: e.target.value as Filters["order"],
                    }))
                  }
                >
                  <option value="asc">Ascendente</option>
                  <option value="desc">Descendente</option>
                </Select>
              </FormControl>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={3}>
            <Button
              variant="outline"
              onClick={() => {
                onClear();
                onClose();
              }}
            >
              Limpiar
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                const clean = (f: Filters): Filters =>
                  Object.fromEntries(
                    Object.entries(f).filter(([k, v]) => {
                      if (v === "" || v === null || v === undefined)
                        return false;
                      if (k === "studentId" && !v) return false; // 0 = "Todos"
                      if (k === "status" && v === "all") return false;
                      if (k === "order" && v === "asc") return false;
                      return true;
                    })
                  ) as Filters;

                onApply(clean(local));
                onClose();
              }}
            >
              Aplicar
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
