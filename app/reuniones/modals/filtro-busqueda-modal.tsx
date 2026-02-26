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
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import AsyncSelect from "react-select/async";
import { Option } from "../../alumnos/type/option.type";
import { Filters } from "../type/filters.type";
import { OptionItem } from "../type/student-option.type";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (f: Filters) => void;
  onClear: () => void;
  loadStudents: (search: string) => Promise<OptionItem[]>;
  students?: OptionItem[];
  loadTutors: (search: string) => Promise<OptionItem[]>;
  tutors?: OptionItem[];
  current?: Filters;
};

export default function FilterMeetingsModal({
  isOpen,
  onClose,
  onApply,
  loadStudents,
  loadTutors,
  onClear,
  students = [],
  tutors = [],
  current,
}: Props) {
  const [local, setLocal] = useState<Filters>({
    status: "all",
    order: "desc",
  });

  useEffect(() => {
    if (!isOpen) return;

    loadStudentOptions("");
    loadTutorOptions("");
  }, [isOpen]);

  useEffect(() => {
    setLocal({
      status: current?.status ?? "all",
      order: current?.order ?? "desc",
      from: current?.from ?? "",
      to: current?.to ?? "",
      studentId: current?.studentId,
      tutorId: current?.tutorId,
    });
  }, [current, isOpen]);

  const toOption = (s: OptionItem): Option => ({
    value: s.id,
    label: s.label,
  });

  const initialStudentOptions = useMemo<Option[]>(
    () =>
      (students ?? [])
        .filter((s, idx, arr) => arr.findIndex((x) => x.id === s.id) === idx)
        .map(toOption),
    [students],
  );

  const initialTutorOptions = useMemo<Option[]>(
    () =>
      (tutors ?? [])
        .filter((t, idx, arr) => arr.findIndex((x) => x.id === t.id) === idx)
        .map(toOption),
    [tutors],
  );

  const selectedStudentOption = useMemo<Option | null>(() => {
    if (!local.studentId) return null;
    return (
      initialStudentOptions.find((o) => o.value === local.studentId) ?? null
    );
  }, [local.studentId, initialStudentOptions]);

  const selectedTutorOption = useMemo<Option | null>(() => {
    if (!local.tutorId) return null;
    return initialTutorOptions.find((o) => o.value === local.tutorId) ?? null;
  }, [local.tutorId, initialTutorOptions]);

  const cacheRef = useRef<Map<string, Option[]>>(new Map());

  const loadStudentOptions = async (inputValue: string): Promise<Option[]> => {
    const q = (inputValue ?? "").trim();
    if (cacheRef.current.has(`stu:${q}`)) {
      const cached = cacheRef.current.get(`stu:${q}`)!;
      if (cached.length > 0) return cached;
    }

    try {
      const list = await loadStudents(q);
      const opts: Option[] = list
        .map((s) => ({
          value: s.id,
          label: s.label,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, "es"));

      cacheRef.current.set(`stu:${q}`, opts);
      return opts;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const loadTutorOptions = async (inputValue: string): Promise<Option[]> => {
    const q = (inputValue ?? "").trim();
    if (cacheRef.current.has(`tut:${q}`)) {
      const cached = cacheRef.current.get(`tut:${q}`)!;
      if (cached.length > 0) return cached;
    }

    try {
      const list = await loadTutors(q);
      const opts: Option[] = list
        .map((s) => ({
          value: s.id,
          label: s.label,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, "es"));

      cacheRef.current.set(`tut:${q}`, opts);
      return opts;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

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

            <FormControl>
              <FormLabel>Alumno</FormLabel>
              <AsyncSelect
                cacheOptions
                defaultOptions={
                  initialStudentOptions.length ? initialStudentOptions : true
                }
                loadOptions={loadStudentOptions}
                isClearable
                value={selectedStudentOption}
                onChange={(opt) =>
                  setLocal((p) => ({
                    ...p,
                    studentId: opt ? (opt as Option).value : undefined,
                  }))
                }
                placeholder="Buscar alumno por nombre, apellido o email..."
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "#3182ce",
                    borderRadius: 8,
                    boxShadow: "none",
                    ":hover": { borderColor: "#2b6cb0" },
                    minHeight: 40,
                  }),
                  menu: (base) => ({ ...base, zIndex: 10 }),
                }}
              />

              <FormLabel mt={4}>Tutor</FormLabel>
              <AsyncSelect
                cacheOptions
                defaultOptions={
                  initialTutorOptions.length ? initialTutorOptions : true
                }
                loadOptions={loadTutorOptions}
                isClearable
                value={selectedTutorOption}
                onChange={(opt) =>
                  setLocal((p) => ({
                    ...p,
                    tutorId: opt ? (opt as Option).value : undefined,
                  }))
                }
                placeholder="Buscar tutor por nombre o apellido..."
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "#3182ce",
                    borderRadius: 8,
                    boxShadow: "none",
                    ":hover": { borderColor: "#2b6cb0" },
                    minHeight: 40,
                  }),
                  menu: (base) => ({ ...base, zIndex: 10 }),
                }}
              />
            </FormControl>

            <HStack>
              <FormControl>
                <FormLabel mt={3}>Estado</FormLabel>
                <select
                  value={local.status ?? "all"}
                  onChange={(e) =>
                    setLocal((p) => ({
                      ...p,
                      status: e.target.value as Filters["status"],
                    }))
                  }
                  style={{
                    height: 40,
                    borderRadius: 8,
                    border: "1px solid #CBD5E0",
                    padding: "0 12px",
                  }}
                >
                  <option value="all">Todos</option>
                  <option value="PENDING">Pendiente</option>
                  <option value="REPORTMISSING">Falta reporte</option>
                  <option value="COMPLETED">Completada</option>
                </select>
              </FormControl>

              <FormControl>
                <FormLabel mt={3}>Orden</FormLabel>
                <select
                  value={local.order ?? "desc"}
                  onChange={(e) =>
                    setLocal((p) => ({
                      ...p,
                      order: e.target.value as Filters["order"],
                    }))
                  }
                  style={{
                    height: 40,
                    borderRadius: 8,
                    border: "1px solid #CBD5E0",
                    padding: "0 12px",
                  }}
                >
                  <option value="asc">Ascendente</option>
                  <option value="desc">Descendente</option>
                </select>
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
                      if (k === "studentId" && !v) return false;
                      if (k === "status" && v === "all") return false;
                      if (k === "order" && v === "desc") return false;
                      return true;
                    }),
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
