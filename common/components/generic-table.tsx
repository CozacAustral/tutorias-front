import React, { ReactNode, useState } from "react";
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

interface GenericTableProps<T> {
  data: T[];
  pageTitle?: ReactNode;
  hideToolbarCaption?: boolean;
  offsetLeft?: string;

  // Paginado (server-like como PaginateStudent)
  showPagination?: boolean;
  currentPage?: number;            // requerido para server pagination
  totalItems?: number;             // requerido para server pagination
  itemsPerPage?: number;
  onPageChange?: (newPage: number) => void;
  searchTerm?: string;
  onSearch?: (term: string) => void;
  orderBy?: [string, "ASC" | "DESC"];
  onOrderChange?: (field: string, direction: "ASC" | "DESC") => void;

  topRightComponent?: ReactNode;
  caption: ReactNode;
  TableHeader: string[];
  renderRow: (row: T, index: number) => React.ReactNode;
  showAddMenu?: boolean;
  onImportOpen?: () => void;
  onCreateOpen?: () => void;
  compact?: boolean;

  // Opcionales de layout
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
  offsetLeft = "104234234234px",
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
  showPagination = false,
  currentPage,
  totalItems,
  onPageChange,
}: GenericTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");

  const isServerPaginated =
    !!showPagination &&
    typeof currentPage !== "undefined" &&
    typeof totalItems !== "undefined";

  const filteredData = data.filter((row) =>
    JSON.stringify(row).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (term: string) => setSearchTerm(term);

  const effectiveItems = typeof totalItems === "number" ? totalItems : filteredData.length;
  const totalPages = Math.max(1, Math.ceil(effectiveItems / itemsPerPage));
  const page = Math.min(Math.max((currentPage ?? 1), 1), totalPages);

  const goPrev = () => {
    if (page === 1) return;
    onPageChange?.(page - 1);
  };

  const goNext = () => {
    if (page >= totalPages) return;
    onPageChange?.(page + 1);
  };

  const widthAccordingToModal = (index: number) => {
    if (careerModalEdit)
      return index === 0 ? "55%" : `${45 / (TableHeader.length - 1)}%`;
    if (subjectModalEdit)
      return index === 1 ? "15%" : `${80 / (TableHeader.length - 1)}%`;
    return index === 0 ? "40%" : `${60 / (TableHeader.length - 1)}%`;
  };

  const captionLabel = typeof caption === "string" ? caption : "";

  return (
    <Box
      maxH="100vh"
      maxW="100vw"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      paddingX={paddingX ?? 4}
      paddingY={paddingY ?? 2}
      paddingLeft={isInModal ? 0 : { base: 4, md: "90px", lg: offsetLeft }}
      overflow="hidden"
      minH={minH ?? (isInModal ? "auto" : "100%")}
      width="100%"
    >
      <Box
        width={width ?? "100%"}
        backgroundColor="white"
        borderRadius="20px"
        padding={3}
        display="flex"
        flexDirection="column"
        flex={isInModal ? "1" : flex ?? "1"}
        height={height ?? (isInModal ? "100%" : undefined)}
      >
        <Flex
          mb={6}
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          marginTop="20px"
          flexWrap={{ base: "wrap", lg: "nowrap" }}
          rowGap={4}
          columnGap={4}
        >
          {!hideToolbarCaption && (
            <Text
              fontSize={
                isInModal
                  ? "28px"
                  : (fontSize as any) ?? { base: "3xl", md: "4xl", lg: "5xl" }
              }
              color="black"
              ml="15px"
              mb="2px"
              whiteSpace="nowrap"
              flex="0 1 auto"
              minW={0}
            >
              {caption}
            </Text>
          )}

          <HStack
            flex="0 0 auto"
            minW={0}
            justifyContent="flex-end"
            spacing={3}
            gap="12px"
            mr={0}
            flexWrap={{ base: "wrap", lg: "nowrap" }}
            alignItems="center"
          >
            <Box width={{ base: "200px", sm: "240px", md: "280px", lg: "220px" }}>
              <Search onSearch={handleSearch} />
            </Box>

            <Menu>
              <MenuButton as={InputGroup} width={{ base: "140px", md: "150px" }}>
                <Input placeholder="Ordenar por..." readOnly fontSize="sm" size="md" />
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
              <MenuButton as={InputGroup} width={{ base: "140px", md: "150px" }}>
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
                <MenuButton
                  as={IconButton}
                  aria-label="Opciones"
                  icon={<SmallAddIcon />}
                  size="md"
                />
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

        <TableContainer
          marginBottom={4}
          width="100%"
          maxWidth={{ base: "100%", lg: "1400px" }}
          display="flex"
          justifyContent="center"
          margin="0 auto"
          overflowX="auto"
          overflowY="visible"
        >
          <Table variant="simple" size="sm" width="100%">
            <Thead>
              <Tr>
                {TableHeader.map((header, index) => (
                  <Th
                    key={index}
                    fontWeight={500}
                    color="#B5B7C0"
                    width={widthAccordingToModal(index)}
                  >
                    {header}
                  </Th>
                ))}
                <Th width="200px">Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {(isServerPaginated ? data : filteredData).map((row, index) =>
                renderRow(row, index)
              )}

              {compact &&
                (isServerPaginated ? data : filteredData).length < itemsPerPage &&
                Array.from({
                  length:
                    itemsPerPage -
                    (isServerPaginated ? data : filteredData).length,
                }).map((_, i) => (
                  <Tr key={`empty-${i}`} height="50px">
                    {TableHeader.map((_, colIndex) => (
                      <Td key={colIndex}>&nbsp;</Td>
                    ))}
                    <Td>&nbsp;</Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>

        {showPagination && (
          compact ? (
            <Flex
              justifyContent="space-between"
              alignItems="center"
              marginTop={0}
              paddingX="8px"
              width="100%"
            >
              <Button
                onClick={goPrev}
                isDisabled={page === 1}
                leftIcon={<ChevronLeftIcon />}
                variant="ghost"
                size="sm"
              />
              <Text> Página {page} / {totalPages} </Text>
              <Button
                onClick={goNext}
                isDisabled={page >= totalPages}
                rightIcon={<ChevronRightIcon />}
                variant="ghost"
                size="sm"
              />
            </Flex>
          ) : (
            <TableContainer
              width="100%"
              maxWidth={{ base: "100%", lg: "1400px" }}
              margin="0 auto"
              overflowX="visible"
              overflowY="visible"
            >
              <Flex
                justifyContent="space-between"
                alignItems="center"
                marginTop={2}
                width="100%"
              >
                <Button
                  onClick={goPrev}
                  isDisabled={page === 1}
                  leftIcon={<ChevronLeftIcon />}
                  variant="ghost"
                />
                <Text> Página {page}/{totalPages} </Text>
                <Button
                  onClick={goNext}
                  isDisabled={page >= totalPages}
                  rightIcon={<ChevronRightIcon />}
                  variant="ghost"
                />
              </Flex>
            </TableContainer>
          )
        )}
      </Box>
    </Box>
  );
};

export default GenericTable;
