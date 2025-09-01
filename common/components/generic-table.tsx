import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useState } from "react";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SmallAddIcon,
  TriangleDownIcon,
} from "@chakra-ui/icons";
import Search from "../../app/ui/search";

interface GenericTableProps<T> {
  data: T[];
  caption: string;
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
  data,
  caption,
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
}: GenericTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const filteredData = data.filter((row) =>
    JSON.stringify(row).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const nextPage = () => {
    if (endIndex < filteredData.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const widthAccordingToModal = (index: number) => {
    if (careerModalEdit) {
      return index === 0 ? "55%" : `${45 / (TableHeader.length - 1)}%`;
    }

    if (subjectModalEdit) {
      return index === 1 ? "15%" : `${80 / (TableHeader.length - 1)}%`;
    }

    return index === 0 ? "40%" : `${60 / (TableHeader.length - 1)}%`;
  };

  return (
    <Box
      overflow="hidden"
      minH={minH ?? (isInModal ? "auto" : "100vh")}
      maxHeight={isInModal ? "calc(100vh - 200px)" : undefined}
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      paddingX={paddingX ? paddingX : 4}
      paddingY={paddingY ?? (isInModal ? 0 : 4)}
    >
      {!isInModal && (
        <Box width="100%" maxWidth="1200px" mb={4}>
          <Text
            fontSize={fontSize ? fontSize : "6xl"}
            color="black"
            marginLeft={marginLeft ? marginLeft : "0"}
            marginTop={marginTop ? marginTop : "7"}
            fontWeight={600}
          >
            {caption}
          </Text>
        </Box>
      )}

      <Box
        width={width ?? "100%"}
        maxWidth={maxWidth ? maxWidth : isInModal ? "100%" : "1210px"}
        backgroundColor="white"
        borderRadius="20px"
        padding={padding ?? 4}
        display="flex"
        flexDirection="column"
        flex={isInModal ? "1" : flex ? flex : "1"}
        height={height ? height : isInModal ? "100%" : undefined}
      >
        {caption && (
          <Flex
            mb={7}
            width="100%"
            justifyContent="space-between"
            alignItems="center"
            flexWrap={{ base: "wrap", lg: "nowrap" }}
            gap={{ base: 2, md: 4 }}
          >
            <Text
              fontSize={isInModal ? "28px" : fontSize ? fontSize : "2xl"}
              color="black"
              fontWeight="bold"
              marginLeft={marginLeft}
            >
              {caption}
            </Text>

            <HStack spacing={2} gap="20px">
              <Box width={isInModal ? "140px" : "auto"}>
                <Search onSearch={handleSearch} />
              </Box>

              <Menu>
                <MenuButton
                  as={InputGroup}
                  width={isInModal ? "140px" : "200px"}
                >
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
                <MenuButton
                  as={InputGroup}
                  width={isInModal ? "140px" : "200px"}
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
              careerModalEdit && subjectModalEdit
                ? { tableLayout: "fixed", width: "100%" }
                : undefined
            }
            marginBottom={2}
          >
            <Thead>
              <Tr>
                {TableHeader.map((header, index) => (
                  <Th
                    key={index}
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
              {currentData.map((row, index) => renderRow(row, index))}
              {compact &&
                currentData.length < itemsPerPage &&
                Array.from({ length: itemsPerPage - currentData.length }).map(
                  (_, index) => (
                    <Tr key={`empty-${index}`} height="57px">
                      {TableHeader.map((_, colIndex) => (
                        <Td key={colIndex}>&nbsp;</Td>
                      ))}
                      <Td>&nbsp;</Td>
                    </Tr>
                  )
                )}
            </Tbody>
          </Table>
        </TableContainer>

        {compact && (
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
              onClick={prevPage}
              isDisabled={currentPage === 1}
              leftIcon={<ChevronLeftIcon />}
              variant="ghost"
              size={isInModal ? "sm" : "md"}
            ></Button>
            <Text>
              {" "}
              Página {currentPage}/{totalPages}
            </Text>
            <Button
              onClick={nextPage}
              isDisabled={endIndex >= filteredData.length}
              rightIcon={<ChevronRightIcon />}
              variant="ghost"
              size={isInModal ? "sm" : "md"}
            ></Button>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default GenericTable;
