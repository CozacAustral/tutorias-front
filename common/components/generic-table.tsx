// common/components/generic-table.tsx
import React, { ReactNode, useState } from "react";
import {
  Box, Flex, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Text,
  Button, InputGroup, InputRightElement, Input, Menu, MenuButton, MenuList,
  MenuItem, IconButton, HStack
} from "@chakra-ui/react";
import { SmallAddIcon, TriangleDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Search from "../../app/ui/search";

interface GenericTableProps<T> {
  data: T[];
  pageTitle?: ReactNode;
  hideToolbarCaption?: boolean;

  // ⬇️ NUEVO: espacio izquierdo para “correr” todo cuando la sidebar está visible
  offsetLeft?: string; // ej: "6.5rem" | "17rem"

  // Paginación (server-side controlada)
  showPagination?: boolean;
  currentPage?: number;                // página actual (server)
  totalItems?: number;                 // total de registros (server)
  onPageChange?: (newPage: number) => void;

  topRightComponent?: ReactNode;
  caption: ReactNode;
  TableHeader: string[];
  renderRow: (row: T, index: number) => React.ReactNode;
  showAddMenu?: boolean;
  onImportOpen?: () => void;
  onCreateOpen?: () => void;
  compact?: boolean;
  itemsPerPage?: number;
  minH?: string;
  paddingX?: number;
  paddingY?: number;
  fontSize?: string;
  marginLeft?: string;
  marginTop?: string;
  width?: string;
  maxWidth?: string;
  padding?: number;
  flex?: string;
  height?: string;
  widthTable?: number;
  isInModal?: boolean;
  careerModalEdit?: boolean;
  subjectModalEdit?: boolean;
}

const GenericTable = <T,>({
  topRightComponent,
  data,
  caption,
  pageTitle,
  hideToolbarCaption = false,
  offsetLeft = "0",                 // ⬅️ default sin sidebar
  TableHeader,
  renderRow,
  showAddMenu = false,
  onImportOpen,
  onCreateOpen,
  compact,
  itemsPerPage = 10,
  minH,
  paddingX,
  paddingY,
  fontSize,
  marginLeft,
  marginTop,
  width,
  maxWidth,
  padding,
  flex,
  height,
  widthTable,
  isInModal = false,
  careerModalEdit = false,
  subjectModalEdit = false,

  // Paginación controlada (server)
  showPagination = false,
  currentPage,
  totalItems,
  onPageChange,
}: GenericTableProps<T>) => {
  // ⬇️ Estado interno solo para modo local
  const [internalPage, setInternalPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Detecta si estamos en modo paginación server-side
  const isServerPaginated =
    !!showPagination &&
    typeof currentPage !== "undefined" &&
    typeof totalItems !== "undefined";

  // Búsqueda local solo cuando NO es server-side (si es server, no filtramos la "página" que ya vino lista)
  const filteredData = isServerPaginated
    ? data
    : data.filter((row) =>
        JSON.stringify(row).toLowerCase().includes(searchTerm.toLowerCase())
      );

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!isServerPaginated) setInternalPage(1);
  };

  // Página y totales a usar según el modo
  const localPage = isServerPaginated ? (currentPage as number) : internalPage;
  const totalCount = isServerPaginated ? (totalItems as number) : filteredData.length;

  const startIndex = (localPage - 1) * itemsPerPage;
  const endIndex   = startIndex + itemsPerPage;

  // Si es server, ya viene paginado: usamos "data" tal cual
  const currentData = isServerPaginated
    ? data
    : filteredData.slice(startIndex, endIndex);

  const totalPages  = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const prevPage = () => {
    if (localPage === 1) return;
    if (isServerPaginated) {
      onPageChange?.(localPage - 1);
    } else {
      setInternalPage((p) => Math.max(1, p - 1));
    }
  };

  const nextPage = () => {
    if (localPage >= totalPages) return;
    if (isServerPaginated) {
      onPageChange?.(localPage + 1);
    } else {
      setInternalPage((p) => p + 1);
    }
  };

  const widthAccordingToModal = (index: number) => {
    if (careerModalEdit) return index === 0 ? "55%" : `${45 / (TableHeader.length - 1)}%`;
    if (subjectModalEdit) return index === 1 ? "15%" : `${80 / (TableHeader.length - 1)}%`;
    return index === 0 ? "40%" : `${60 / (TableHeader.length - 1)}%`;
  };

  const captionLabel = typeof caption === "string" ? caption : "";

  return (
    <Box
      pl={offsetLeft}
      pr={4}
      overflow="hidden"
      minH={minH ?? (isInModal ? "auto" : "100vh")}
      display="flex"
      flexDirection="column"
      width="100%"
    >
      {!isInModal && (
        <Box width="100%" mb={0}>
          <Text fontSize={fontSize ?? "6xl"} color="black"  fontWeight={600}>
            {pageTitle ?? caption}
          </Text>
        </Box>
      )}

      <Box
        width={width ?? "100%"}
        maxWidth={maxWidth ?? (isInModal ? "100%" : "1210px")}
        bg="white"
        borderRadius="20px"
        display="flex"
        flexDirection="column"
        flex={isInModal ? "1" : (flex ?? "1")}
        height={height ?? (isInModal ? "100%" : undefined)}
      >
        <Flex
          mb={2}
          w="100%"
          justifyContent="space-between"
          alignItems="center"
          flexWrap={{ base: "wrap", lg: "nowrap" }}
          gap={{ base: 2, md: 4 }}
        >
          {!hideToolbarCaption && (
            <Text fontSize={isInModal ? "28px" : (fontSize ?? "2xl")} color="black" fontWeight="bold">
              {caption}
            </Text>
          )}

          <HStack spacing={2} gap="20px" w="100%" justifyContent="flex-end">
            <Box width={isInModal ? "140px" : "auto"}>
              <Search onSearch={handleSearch} />
            </Box>

            <Menu>
              <MenuButton as={InputGroup} width={isInModal ? "140px" : "200px"}>
                <Input placeholder="Ordenar por..." readOnly size="md" />
                <InputRightElement pointerEvents="none">
                  <TriangleDownIcon color="black" />
                </InputRightElement>
              </MenuButton>
              <MenuList>
                <MenuItem>De la A - Z</MenuItem>
                <MenuItem>De la Z - A</MenuItem>
              </MenuList>
            </Menu>

            <Menu>
              <MenuButton as={InputGroup} width={isInModal ? "140px" : "200px"}>
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

            {showAddMenu && compact ? (
              <Menu>
                <MenuButton as={IconButton} aria-label="Opciones" icon={<SmallAddIcon />} size="md" />
                <MenuList>
                  <MenuItem onClick={onCreateOpen}>
                    Agregar {captionLabel ? captionLabel.slice(0, -1) : "item"}
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : null}

            {topRightComponent}
          </HStack>
        </Flex>

        <TableContainer w="100%" overflow="hidden">
          <Table variant="simple" size="sm" marginBottom={0} w="100%" >
            <Thead>
              <Tr>
                {TableHeader.map((header, index) => (
                  <Th key={index} color="#B5B7C0" width={widthAccordingToModal(index)}>
                    {header}
                  </Th>
                ))}
                <Th width="200px">Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentData.map((row, index) => renderRow(row, index))}
              {compact && currentData.length < itemsPerPage &&
                Array.from({ length: itemsPerPage - currentData.length }).map((_, i) => (
                  <Tr key={`empty-${i}`} height="57px">
                    {TableHeader.map((_, colIndex) => (<Td key={colIndex}>&nbsp;</Td>))}
                    <Td>&nbsp;</Td>
                  </Tr>
                ))
              }
            </Tbody>
          </Table>
        </TableContainer>

        {showPagination && (
          <Flex justifyContent="center" alignItems="center" mt={1} mb={1} minHeight="40px" px={2}>
            <Button
              onClick={prevPage}
              isDisabled={localPage === 1}
              leftIcon={<ChevronLeftIcon />}
              variant="ghost"
            />
            <Text mx={3}>Página {localPage}/{totalPages}</Text>
            <Button
              onClick={nextPage}
              isDisabled={localPage >= totalPages}
              rightIcon={<ChevronRightIcon />}
              variant="ghost"
            />
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default GenericTable;
