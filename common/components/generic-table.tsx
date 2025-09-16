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
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  SmallAddIcon,
  Search2Icon,
  TriangleDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import Search from "../../app/ui/search";
import { useSidebar } from "../../app/contexts/SidebarContext";

interface GenericTableProps<T> {
  leftOffset?: number; // fuerza el gap desde afuera (opcional)
  hasSidebar?: boolean;
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  searchTerm?: string;
  onSearch?: (term: string) => void;
  orderBy?: [string, "ASC" | "DESC"];
  onOrderChange?: (field: string, direction: "ASC" | "DESC") => void;
  topRightComponent?: React.ReactNode;

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
  leftOffset, // fuerza el gap desde afuera (opcional)
  hasSidebar,
  currentPage,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  searchTerm,
  onSearch,
  orderBy,
  onOrderChange,
  topRightComponent,

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
  marginTop,
  width,
  maxWidth,
  padding,
  flex,
  height,
  isInModal = false,
  careerModalEdit = false,
  subjectModalEdit = false,
  filter = true,
  actions = true,
}: GenericTableProps<T>) => {
  const normalizeData = <U,>(
    d: U[] | { data: U[] } | null | undefined
  ): U[] => {
    if (Array.isArray(d)) return d;
    if (d && typeof d === "object" && Array.isArray((d as any).data)) {
      return (d as any).data as U[];
    }
    return [];
  };
  const safeData = normalizeData<T>(data);

  const serverMode =
    typeof currentPage === "number" &&
    typeof totalItems === "number" &&
    typeof onPageChange === "function";

  const [localSearch, setLocalSearch] = useState("");
  const effectiveSearch = searchTerm ?? localSearch;

  const handleSearch = (term: string) => {
    if (onSearch) onSearch(term);
    else {
      setLocalSearch(term);
      setLocalPage(1);
    }
  };

  const [localPage, setLocalPage] = useState(1);
  const page = currentPage ?? localPage;

  const filteredData = onSearch
    ? safeData
    : safeData.filter((row) =>
        JSON.stringify(row)
          .toLowerCase()
          .includes(effectiveSearch.toLowerCase())
      );

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentData = serverMode
    ? filteredData
    : filteredData.slice(startIndex, endIndex);

  const totalPages = serverMode
    ? Math.max(1, Math.ceil((totalItems ?? 0) / itemsPerPage))
    : Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  const goPrev = () => {
    if (page <= 1) return;
    serverMode
      ? onPageChange!(page - 1)
      : setLocalPage((p) => Math.max(1, p - 1));
  };

  const goNext = () => {
    if (page >= totalPages) return;
    serverMode ? onPageChange!(page + 1) : setLocalPage((p) => p + 1);
  };

  // 👉 Solo forzar widths en modales; fuera de modales, dejá que fluya
  const widthAccordingToModal = (index: number) => {
    if (!careerModalEdit && !subjectModalEdit) return undefined; // clave
    if (careerModalEdit)
      return index === 0 ? "55%" : `${45 / (TableHeader.length - 1)}%`;
    if (subjectModalEdit) {
      if (actions === false) {
        const otherCols = TableHeader.length - 1;
        const remaining = 100 - 15;
        return index === 1 ? "15%" : `${remaining / otherCols}%`;
      }
      return index === 1 ? "15%" : `${80 / (TableHeader.length - 1)}%`;
    }
    return undefined;
  };

  const orderLabel = orderBy?.[0]
    ? orderBy[1] === "ASC"
      ? "De la A - Z"
      : "De la Z - A"
    : "Ordenar por...";

  const EXPANDED_W = 240; // ancho sidebar expandido
  const COLLAPSED_W = 72;

  // lee contexto (si no existe, cae en undefined)
  let collapsed = false;
  try {
    collapsed = useSidebar?.().collapsed ?? false;
  } catch {
    /* si no hay provider, seguimos con default */
  }

  // gap por breakpoint (en mobile el sidebar suele ir overlay => 0)
  const bpGap = useBreakpointValue({
    base: 0, // mobile: que no empuje
    md: collapsed ? COLLAPSED_W : EXPANDED_W, // md+: empuja
  });

  // si viene prop, manda la prop; si no, usa cálculo
  const LEFT_GAP =
    typeof leftOffset === "number"
      ? leftOffset
      : hasSidebar === false
      ? 0
      : bpGap ?? 0;

  return (
    <Box
      overflow="hidden"
      minH={minH ?? (isInModal ? "auto" : "unset")}
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      ml={`${LEFT_GAP}px`}
      w={`calc(100% - ${LEFT_GAP}px)`}
      maxW="100%"
      px={paddingX ?? 0}
      py={paddingY ?? 0}
      transition="margin .2s ease, width .2s ease"
    >

      <Box
        w={width ?? "100%"}
        // maxW viejo: "clamp(320px, 92vw, 1200px)"
        maxW={maxWidth ?? { base: "100%", xl: "1200px" }} // ✅ sin vw
        mx="auto"
        bg="white"
        borderRadius="20px"
        p={padding ?? { base: 3, md: 4 }}
        display="flex"
        flexDirection="column"
        flex={isInModal ? "1" : flex ?? "1"}
        h={height ?? (isInModal ? "100%" : undefined)}
        boxShadow="sm"
      >
        {/* Toolbar superior */}
        <Flex
          mb={3}
          w="100%"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={{ base: 2, md: 4 }}
        >
          <Text
            fontSize={isInModal ? "xl" : "2xl"}
            color="black"
            fontWeight="bold"
          >
            {caption}
          </Text>

          <HStack spacing={2} gap="20px" flexWrap="wrap">
            <Box w={{ base: "100%", sm: "260px" }}>
              <InputGroup>
                <InputRightElement mb={2}>
                  <Search2Icon />
                </InputRightElement>
              </InputGroup>
              <Search onSearch={handleSearch} />
            </Box>

            {onOrderChange && (
              <Menu>
                <MenuButton
                  as={InputGroup}
                  width={{ base: "100%", sm: "200px" }}
                >
                  <Input
                    placeholder="Ordenar por..."
                    value={orderLabel}
                    readOnly
                    size="md"
                  />
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
                <MenuButton
                  as={InputGroup}
                  width={{ base: "100%", sm: "200px" }}
                >
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

            {topRightComponent}

            {showAddMenu || compact ? (
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

        <TableContainer overflowX={{ base: "auto", md: "visible" }}>
          <Table
            variant="simple"
            size="sm"
            // 👉 fuera de modales: layout fijo + auto widths para que reparta mejor
            style={
              careerModalEdit || subjectModalEdit
                ? { tableLayout: actions ? "auto" : "fixed", width: "100%" }
                : { tableLayout: "fixed", width: "100%" }
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
            mb={0}
          >
            <Thead>
              <Tr>
                {TableHeader.map((header, index) => (
                  <Th
                    key={index}
                    color="#B5B7C0"
                    // 👉 solo forzar width cuando estás en modal
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
                  (_, i) => (
                    <Tr key={`empty-${i}`} height="57px">
                      {TableHeader.map((_, colIndex) => (
                        <Td key={colIndex} />
                      ))}
                      {actions ? <Td width="150px">&nbsp;</Td> : null}
                    </Tr>
                  )
                )}
            </Tbody>
          </Table>
        </TableContainer>

        <Flex
          justifyContent="space-between"
          alignItems="center"
          mt={1}
          mb={2}
          flexShrink={0}
          minH="40px"
          px={2}
        >
          <Button
            onClick={goPrev}
            isDisabled={page === 1}
            leftIcon={<ChevronLeftIcon />}
            variant="ghost"
            size={isInModal ? "sm" : "md"}
          />
          <Text>
            {" "}
            Página {page}/{totalPages}{" "}
          </Text>
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
