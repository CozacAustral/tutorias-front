import React, { useState } from "react";
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
  Search2Icon,
  TriangleDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import Search from "../../app/ui/search";

interface GenericTableProps<T> {
  // ---- NUEVO: server-side pagination / búsqueda / orden ----
  currentPage?: number;                            // 1-based
  totalItems?: number;                             // total global del backend
  itemsPerPage?: number;                           // default 10
  onPageChange?: (page: number) => void;           // callback para pedir otra página
  searchTerm?: string;                             // término actual (controlado afuera)
  onSearch?: (term: string) => void;               // callback de búsqueda (server)
  orderBy?: [string, "ASC" | "DESC"];              // campo y dirección
  onOrderChange?: (field: string, direction: "ASC" | "DESC") => void;
  topRightComponent?: React.ReactNode;

  // ---- existentes ----
  data: T[] | { data: T[] } | null | undefined;
  caption: string;
  TableHeader: string[];
  renderRow: (row: T, index: number) => React.ReactNode;
  showAddMenu?: boolean;
  onImportOpen?: () => void;
  onCreateOpen?: () => void;
  compact?: boolean;
  filter?: boolean;
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
  actions?: boolean | null;
}

const GenericTable = <T,>({
  // server-side props (opcionales)
  currentPage,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  searchTerm,
  onSearch,
  orderBy,
  onOrderChange,
  topRightComponent,

  // existentes
  data,
  caption,
  TableHeader,
  renderRow,
  showAddMenu = false,
  onImportOpen,
  onCreateOpen,
  compact,
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
  filter = true,
  actions = true,
}: GenericTableProps<T>) => {
  // ---- helper para normalizar data ----
  const normalizeData = <U,>(d: U[] | { data: U[] } | null | undefined): U[] => {
    if (Array.isArray(d)) return d;
    if (d && typeof d === "object" && Array.isArray((d as any).data)) {
      return (d as any).data as U[];
    }
    return [];
  };
  const safeData = normalizeData<T>(data);

  // ---- modo server vs local ----
  const serverMode =
    typeof currentPage === "number" &&
    typeof totalItems === "number" &&
    typeof onPageChange === "function";

  // ---- búsqueda: si recibo onSearch => server, si no => local ----
  const [localSearch, setLocalSearch] = useState("");
  const effectiveSearch = searchTerm ?? localSearch;

  const handleSearch = (term: string) => {
    if (onSearch) onSearch(term); // server
    else {
      setLocalSearch(term);       // local
      setLocalPage(1);
    }
  };

  // ---- paginado local ----
  const [localPage, setLocalPage] = useState(1);
  const page = currentPage ?? localPage;

  // ---- filtrado local si no hay onSearch ----
  const filteredData = onSearch
    ? safeData // server: el back ya filtró
    : safeData.filter((row) =>
        JSON.stringify(row).toLowerCase().includes(effectiveSearch.toLowerCase())
      );

  // ---- datos a mostrar ----
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentData = serverMode
    ? filteredData // server: ya viene paginado
    : filteredData.slice(startIndex, endIndex);

  const totalPages = serverMode
    ? Math.max(1, Math.ceil((totalItems ?? 0) / itemsPerPage))
    : Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  const goPrev = () => {
    if (page <= 1) return;
    serverMode ? onPageChange!(page - 1) : setLocalPage((p) => Math.max(1, p - 1));
  };

  const goNext = () => {
    if (page >= totalPages) return;
    serverMode ? onPageChange!(page + 1) : setLocalPage((p) => p + 1);
  };

  const widthAccordingToModal = (index: number) => {
    if (careerModalEdit) return index === 0 ? "55%" : `${45 / (TableHeader.length - 1)}%`;

    if (subjectModalEdit) {
      if (actions === false && careerModalEdit === false) {
        const otherCols = TableHeader.length - 1;
        const remaining = 100 - 15;
        return index === 1 ? "15%" : `${remaining / otherCols}%`;
      }
      return index === 1 ? "15%" : `${80 / (TableHeader.length - 1)}%`;
    }

    return index === 0 ? "40%" : `${60 / (TableHeader.length - 1)}%`;
  };

  // etiqueta de orden
  const orderLabel =
    orderBy?.[0]
      ? orderBy[1] === "ASC"
        ? "De la A - Z"
        : "De la Z - A"
      : "Ordenar por...";

  return (
    <Box
      overflow="hidden"
      minH={minH ?? (isInModal ? "auto" : "100vh")}
      maxHeight={isInModal ? "calc(100vh - 200px)" : undefined}
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      paddingX={paddingX ?? 4}
      paddingY={paddingY ?? (isInModal ? 0 : 4)}
    >
      {!isInModal && (
        <Box width="100%" maxWidth="1200px" mb={4}>
          <Text
            fontSize={fontSize ?? "6xl"}
            color="black"
            marginLeft={marginLeft ?? "0"}
            marginTop={marginTop ?? "7"}
            fontWeight={600}
          >
            {caption}
          </Text>
        </Box>
      )}

      <Box
        width={width ?? "100%"}
        maxWidth={maxWidth ?? (isInModal ? "100%" : "1210px")}
        backgroundColor="white"
        borderRadius="20px"
        padding={padding ?? 4}
        display="flex"
        flexDirection="column"
        flex={isInModal ? "1" : (flex ?? "1")}
        height={height ?? (isInModal ? "100%" : undefined)}
      >
        {caption && (
          <Flex
            mb={3}
            width="100%"
            justifyContent="space-between"
            alignItems="center"
            flexWrap={{ base: "wrap", lg: "nowrap" }}
            gap={{ base: 2, md: 4 }}
          >
            <Text
              fontSize={isInModal ? "28px" : (fontSize ?? "2xl")}
              color="black"
              fontWeight="bold"
              marginLeft={marginLeft}
            >
              {caption}
            </Text>

            <HStack spacing={2} gap="20px">
              {/* Buscar */}
              <Box width={isInModal ? "140px" : "200px"}>
                <InputGroup>
                  <InputRightElement mb={2}>
                    <Search2Icon />
                  </InputRightElement>
                </InputGroup>
                <Search onSearch={handleSearch} />
              </Box>

              {/* Ordenar (solo si hay onOrderChange) */}
              {onOrderChange && (
                <Menu>
                  <MenuButton as={InputGroup} width={isInModal ? "140px" : "200px"}>
                    <Input placeholder="Ordenar por..." value={orderLabel} readOnly size="md" />
                    <InputRightElement pointerEvents="none">
                      <TriangleDownIcon color="black" />
                    </InputRightElement>
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => onOrderChange!("name", "ASC")}>
                      De la A - Z
                    </MenuItem>
                    <MenuItem onClick={() => onOrderChange!("name", "DESC")}>
                      De la Z - A
                    </MenuItem>
                    <MenuItem onClick={() => onOrderChange!("createdAt", "DESC")}>
                      Por defecto
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}

              {filter ? (
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
              ) : null}

              {/* Acción derecha opcional */}
              {topRightComponent}

              {/* Menú agregar (si aplica) */}
              {showAddMenu && compact ? (
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Opciones"
                    icon={<SmallAddIcon />}
                    size="md"
                  />
                  <MenuList>
                    <MenuItem onClick={onCreateOpen}>
                      Agregar {caption.slice(0, -1)}
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : undefined}
            </HStack>
          </Flex>
        )}

        <TableContainer>
          <Table
            variant="simple"
            size="sm"
            style={
              careerModalEdit || subjectModalEdit
                ? { tableLayout: actions ? "auto" : "fixed", width: "100%" }
                : undefined
            }
            sx={{
              "th, td": {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
              "thead tr": { height: "56px" },
              "tbody tr": { height: "56px" },
            }}
            marginBottom={0}
          >
            <Thead>
              <Tr>
                {TableHeader.map((header, index) => (
                  <Th
                    key={index}
                    color="#B5B7C0"
                    width={widthAccordingToModal(index)}
                    maxW={widthAccordingToModal(index)}
                  >
                    {header}
                  </Th>
                ))}
                {actions ? <Th width="150px"></Th> : null}
              </Tr>
            </Thead>
            <Tbody>
              {currentData.map((row, index) => renderRow(row, index))}
              {compact &&
                currentData.length < itemsPerPage &&
                Array.from({ length: itemsPerPage - currentData.length }).map(
                  (_, index) => (
                    <Tr key={`empty-${index}`} height="57px">
                      {TableHeader.map((_, colIndex) => (
                        <Td
                          key={colIndex}
                          width={widthAccordingToModal(colIndex)}
                          maxW={widthAccordingToModal(colIndex)}
                        >
                          &nbsp;
                        </Td>
                      ))}
                      {actions ? <Td width="150px">&nbsp;</Td> : null}
                    </Tr>
                  )
                )}
            </Tbody>
          </Table>
        </TableContainer>

        {/* Paginador (ahora funciona server/local igual que PaginateStudent) */}
        <Flex
          justifyContent="space-between"
          alignItems="center"
          marginTop={1}
          marginBottom={2}
          flexShrink={0}
          minHeight="40px"
          paddingX={2}
        >
          <Button
            onClick={goPrev}
            isDisabled={page === 1}
            leftIcon={<ChevronLeftIcon />}
            variant="ghost"
            size={isInModal ? "sm" : "md"}
          />
          <Text> Página {page}/{totalPages} </Text>
          <Button
            onClick={goNext}
            isDisabled={page >= totalPages}
            rightIcon={<ChevronRightIcon />}
            variant="ghost"
            size={isInModal ? "sm" : "md"}
          />
        </Flex>
      </Box>
    </Box>
  );
};

export default GenericTable;
