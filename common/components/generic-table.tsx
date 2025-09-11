"use client";
import React, { ReactNode } from "react";
import {
  Box,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Button,
  InputGroup,
  InputRightElement,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import {
  SmallAddIcon,
  TriangleDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import Search from "../../app/ui/search";

export interface GenericTableProps<T> {
  data: T[];
  caption: ReactNode;
  TableHeader: string[];
  renderRow: (row: T, index: number) => React.ReactNode;

  showAddMenu?: boolean;
  onImportOpen?: () => void;
  onCreateOpen?: () => void;

  showPagination?: boolean;
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (newPage: number) => void;

  searchTerm?: string;
  onSearch?: (term: string) => void;
  orderBy?: [string, "ASC" | "DESC"];
  onOrderChange?: (field: string, direction: "ASC" | "DESC") => void;

  compact?: boolean;
  paddingX?: number;
  paddingY?: number;
  offsetLeft?: string;

  topRightComponent?: ReactNode;
  actionsColWidth?: string | number;
  columnWidths?: (string | number)[]; 
  cellPx?: string | number; 
}

const GenericTable = <T,>({
  data,
  caption,
  TableHeader,
  columnWidths,
  cellPx = "28px",
  renderRow,
  showAddMenu = false,
  onImportOpen,
  onCreateOpen,

  showPagination = true,
  currentPage = 1,
  totalItems,
  itemsPerPage = 10,
  onPageChange,

  searchTerm,
  onSearch,
  orderBy,
  onOrderChange,

  compact = false,
  paddingX,
  paddingY,
  offsetLeft = "135px",
  topRightComponent,
  actionsColWidth = "auto",
}: GenericTableProps<T>) => {
  const effectiveTotal =
    typeof totalItems === "number" ? totalItems : data.length;
  const totalPages = Math.max(1, Math.ceil(effectiveTotal / itemsPerPage));

  const orderOptions = [
    { label: "De la A - Z", field: "name", direction: "ASC" as const },
    { label: "De la Z - A", field: "name", direction: "DESC" as const },
  ];

  const getCurrentOrderLabel = () => {
    if (!orderBy) return "Ordenar por...";
    const current = orderOptions.find(
      (o) => o.field === orderBy[0] && o.direction === orderBy[1]
    );
    return current ? current.label : "Ordenar por...";
  };

  const goPrev = () => onPageChange?.(Math.max(1, currentPage - 1));
  const goNext = () => onPageChange?.(Math.min(totalPages, currentPage + 1));

  return (
    <Box
      maxH="100vh"
      maxW="100vw"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      paddingX={paddingX ?? 16}
      paddingY={paddingY ?? 5}
      paddingLeft={offsetLeft}
    >
      <Box
        width="100%"
        backgroundColor="white"
        borderRadius="20px"
        padding={3}
        display="flex"
        flexDirection="column"
        flex={1}
        height="100%"
      >
        {/* === Toolbar idéntica a Alumnos/PaginateStudent === */}
        <Flex
          mb={10}
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          marginTop="20px"
        >
          <Text fontSize="5xl" ml="15px" mb="2px" color="black">
            {typeof caption === "string" ? caption : "Listado"}
          </Text>

          <HStack spacing={3} mr="35px" flexShrink={0} gap="20px">
            <Box width="220px">
              <Search onSearch={(t) => onSearch?.(t)} />
            </Box>

            <Menu>
              <MenuButton as={InputGroup} width="140px">
                <Input
                  placeholder={getCurrentOrderLabel()}
                  value={getCurrentOrderLabel()}
                  readOnly
                  fontSize="sm"
                  size="md"
                />
                <InputRightElement pointerEvents="none">
                  <TriangleDownIcon color="black" />
                </InputRightElement>
              </MenuButton>
              <MenuList>
                {orderOptions.map((opt, i) => (
                  <MenuItem
                    key={i}
                    onClick={() => onOrderChange?.(opt.field, opt.direction)}
                    bg={
                      orderBy &&
                      orderBy[0] === opt.field &&
                      orderBy[1] === opt.direction
                        ? "gray.100"
                        : "white"
                    }
                  >
                    {opt.label}
                  </MenuItem>
                ))}
                <MenuItem onClick={() => onOrderChange?.("createdAt", "DESC")}>
                  Por defecto
                </MenuItem>
              </MenuList>
            </Menu>

            {/* Filtro placeholder (como Alumnos) */}
            <Menu>
              <MenuButton as={InputGroup} width="140px">
                <Input placeholder="Filtrar por..." readOnly size="md" />
                <InputRightElement pointerEvents="none">
                  <TriangleDownIcon color="black" />
                </InputRightElement>
              </MenuButton>
              <MenuList>
                <MenuItem>Carrera</MenuItem>
                <MenuItem>Año de Ingreso</MenuItem>
              </MenuList>
            </Menu>

            {showAddMenu ? (
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Opciones"
                  icon={<SmallAddIcon />}
                  size="md"
                />
                <MenuList>
                  {onCreateOpen && (
                    <MenuItem onClick={onCreateOpen}>Agregar</MenuItem>
                  )}
                  {onImportOpen && (
                    <MenuItem onClick={onImportOpen}>Importar</MenuItem>
                  )}
                </MenuList>
              </Menu>
            ) : null}

            {topRightComponent}
          </HStack>
        </Flex>

        {/* === Tabla === */}
        <TableContainer
          marginBottom={4}
          width="100%"
          maxWidth={{ base: "0", lg: "1400px" }}
          display="flex"
          justifyContent="center"
          margin="0 auto"
        >
          <Table
            variant="simple"
            size="md"
            width="100%"
            sx={{
              // AIRE ENTRE COLUMNAS
              "thead th, tbody td": { px: cellPx },

              // ALTURA DE FILA (ajusta a gusto)
              "thead th": { py: "5px" },
              "tbody td": { py: "5px" },

              // SEPARADOR ENTRE FILAS
              "tbody tr": {
                borderBottom: "1px solid",
                borderColor: "gray.200",
              },
              "tbody tr:last-of-type": { borderBottom: "none" },

              // ALINEAR ACCIONES
              "thead tr th:last-of-type, tbody tr td:last-of-type": {
                textAlign: "center",
              },
            }}
          >
            <colgroup>
              {TableHeader.map((_, i) => (
                <col key={i} style={{ width: columnWidths?.[i] ?? "auto" }} />
              ))}
              <col
                style={{
                  width:
                    typeof actionsColWidth === "number"
                      ? `${actionsColWidth}px`
                      : actionsColWidth,
                }}
              />
            </colgroup>

            <Thead>
              <Tr>
                {TableHeader.map((header, idx) => (
                  <Th key={idx} fontWeight={500} color="#B5B7C0">
                    {header}
                  </Th>
                ))}
                <Th textAlign="center">Acciones</Th>
              </Tr>
            </Thead>

            <Tbody>
              {data.map((row, i) => renderRow(row, i))}
              {compact &&
                data.length < itemsPerPage &&
                Array.from({ length: itemsPerPage - data.length }).map(
                  (_, i) => (
                    <Tr key={`empty-${i}`} height="50px">
                      {TableHeader.map((_, ci) => (
                        <Td key={ci}>&nbsp;</Td>
                      ))}
                      <Td>&nbsp;</Td>
                    </Tr>
                  )
                )}
            </Tbody>
          </Table>
        </TableContainer>

        {/* === Paginado igual que Alumnos === */}
        {showPagination &&
          (compact ? (
            <Flex
              justifyContent="space-between"
              alignItems="center"
              mt={0}
              px="8px"
              width="100%"
            >
              <Button
                onClick={goPrev}
                isDisabled={currentPage <= 1}
                leftIcon={<ChevronLeftIcon />}
                variant="ghost"
                size="sm"
              />
              <Text>
                {" "}
                Página {currentPage} / {totalPages}{" "}
              </Text>
              <Button
                onClick={goNext}
                isDisabled={currentPage >= totalPages}
                rightIcon={<ChevronRightIcon />}
                variant="ghost"
                size="sm"
              />
            </Flex>
          ) : (
            <TableContainer
              width="100%"
              maxWidth={{ base: "0", lg: "1400px" }}
              margin="0 auto"
              overflowX="visible"
              overflowY="visible"
            >
              <Flex
                justifyContent="space-between"
                alignItems="center"
                mt={2}
                width="100%"
              >
                <Button
                  onClick={goPrev}
                  isDisabled={currentPage <= 1}
                  leftIcon={<ChevronLeftIcon />}
                  variant="ghost"
                />
                <Text>
                  {" "}
                  Página {currentPage}/{totalPages}{" "}
                </Text>
                <Button
                  onClick={goNext}
                  isDisabled={currentPage >= totalPages}
                  rightIcon={<ChevronRightIcon />}
                  variant="ghost"
                />
              </Flex>
            </TableContainer>
          ))}
      </Box>
    </Box>
  );
};

export default GenericTable;
