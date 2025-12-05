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
import { UserService } from "../../../services/admin-service";
import { StudentOption } from '../type/student-option.type';
import { Filters } from '../type/filters.type';
import { Option } from '../../alumnos/type/option.type';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (f: Filters) => void;
  onClear: () => void;
  students?: StudentOption[];
  current?: Filters;
};

export default function FilterMeetingsModal({
  isOpen,
  onClose,
  onApply,
  onClear,
  students = [],
  current,
}: Props) {
  const [local, setLocal] = useState<Filters>({
    status: "all",
    order: "desc",
  });

  useEffect(() => {
    setLocal({
      status: current?.status ?? "all",
      order: current?.order ?? "desc",
      from: current?.from ?? "",
      to: current?.to ?? "",
      studentId: current?.studentId,
    });
  }, [current, isOpen]);

  const toOption = (s: StudentOption): Option => ({
    value: s.id,
    label: s.label,
  });

  const initialOptions = useMemo<Option[]>(
    () =>
      (students ?? [])
        .filter((s, idx, arr) => arr.findIndex((x) => x.id === s.id) === idx)
        .map(toOption),
    [students]
  );

  const selectedOption = useMemo<Option | null>(() => {
    if (!local.studentId) return null;
    const found =
      initialOptions.find((o) => o.value === local.studentId) ?? null;
    return found;
  }, [local.studentId, initialOptions]);

  const cacheRef = useRef<Map<string, Option[]>>(new Map());

  const loadOptions = async (inputValue: string): Promise<Option[]> => {
    const q = (inputValue ?? "").trim();
    if (cacheRef.current.has(q)) return cacheRef.current.get(q)!;

    try {
      const resp = await UserService.getMyStudents(1, 20, q);
      const list = resp?.data?.data ?? resp?.data?.students ?? resp?.data ?? [];

      const opts: Option[] = (list ?? [])
        .map((s: any) => {
          const name = s?.user?.name ?? "";
          const last = s?.user?.lastName ?? "";
          const email = s?.user?.email ?? "";
          const full = [name, last].filter(Boolean).join(" ");
          return {
            value: s.id,
            label: full || email || `Alumno #${s?.id ?? "-"}`,
          } as Option;
        })
        .filter((o: Option) => o.value && o.label)
        .reduce((acc: Option[], cur: Option) => {
          if (!acc.some((x) => x.value === cur.value)) acc.push(cur);
          return acc;
        }, [])
        .sort((a: Option, b: Option) => a.label.localeCompare(b.label, "es"));

      cacheRef.current.set(q, opts);
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
                defaultOptions={initialOptions.length ? initialOptions : true}
                loadOptions={loadOptions}
                isClearable
                value={selectedOption}
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
            </FormControl>

            <HStack>
              <FormControl>
                <FormLabel>Estado</FormLabel>
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
                  <option value="COMPLETED">Confirmada</option>
                </select>
              </FormControl>

              <FormControl>
                <FormLabel>Orden</FormLabel>
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
