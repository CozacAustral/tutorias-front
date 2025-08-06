import React, { useState } from "react";
import {
  Box,
  ChakraProvider,
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
  InputLeftElement,
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
import Search from "../../../app/ui/search";

interface PaginateStudentProps<T> {
  data: T[];
  caption: string;
  TableHeader: string[];
  renderRow: (row: T, index: number) => React.ReactNode;
  showAddMenu?: boolean;
  onImportOpen?: () => void;
  onCreateOpen?: () => void;

  currentPage: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  searchTerm?: string;
  onSearch?: (term: string) => void;
  orderBy?: [string, "ASC" | "DESC"];
  onOrderChange?: (field: string, direction: "ASC" | "DESC") => void;

  compact?: boolean;
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
}

const PaginateStudent = <T,>({
  data,
  caption,
  TableHeader,
  renderRow,
  showAddMenu = false,
  onImportOpen,
  onCreateOpen,

  currentPage,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  searchTerm,
  onSearch,
  orderBy,
  onOrderChange,

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
}: PaginateStudentProps<T>) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const orderOptions = [
    { label: "De la A - Z", field: "name", direction: "ASC" as const },
    { label: "De la Z - A", field: "name", direction: "DESC" as const },
  ];

  const getCurrentOrderLabel = () => {
    if (!orderBy) {
      return "Order por...";
    }
    const current = orderOptions.find(
      (option) => option.field === orderBy[0] && option.direction === orderBy[1]
    );
    return current ? current.label : "Order por...";
  };

  return (
    <Box
      maxH="100vh"
      maxW="100vw"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      paddingX={paddingX ? paddingX : "16px"}
      paddingY={paddingY ? paddingY : "5px"}
      paddingLeft="135px"    
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
        <Flex
          mb={10}
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          marginTop="20px"
        >
          <Text
            fontSize="5xl"
            marginLeft="15px"
            marginBottom="2px"
            color="black"
          >
            {caption}
          </Text>

          <HStack spacing={3} marginRight="35px" flexShrink={0} gap="20px">
            <Box width="220px">
              <Search
                onSearch={(term) => {
                  onSearch?.(term);
                }}
              />
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
                {orderOptions.map((option, index) => (
                  <MenuItem
                    key={index}
                    onClick={() =>
                      onOrderChange?.(option.field, option.direction)
                    }
                    bg={
                      orderBy &&
                      orderBy[0] === option.field &&
                      orderBy[1] === option.direction
                        ? "gray.100"
                        : "white"
                    }
                  >
                    {option.label}
                  </MenuItem>
                ))}
                <MenuItem onClick={() => onOrderChange?.("createdAt", "DESC")}>
                  Por defecto
                </MenuItem>
              </MenuList>
            </Menu>

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

            {showAddMenu && compact ? (
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Opciones"
                  icon={<SmallAddIcon />}
                  size="sm"
                />
                <MenuList>
                  <MenuItem onClick={onCreateOpen}>
                    Agregar {caption.slice(0, -1)}
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Opciones"
                  icon={<SmallAddIcon />}
                  size="md"
                />
                <MenuList>
                  <MenuItem onClick={onCreateOpen}>Agregar Alumno</MenuItem>
                  <MenuItem onClick={onImportOpen}>Importar Alumnos</MenuItem>
                </MenuList>
              </Menu>
            )}
          </HStack>
        </Flex>

        <TableContainer
          marginBottom={4}
          width="100%"
          maxWidth={{ base: "0", lg: "1400px" }}
          display="flex"
          justifyContent="center"
          margin="0 auto"
        >
          <Table variant="simple" size="sm" width="100%">
            <Thead>
              <Tr>
                {TableHeader.map((header, index) => (
                  <Th key={index} fontWeight={500} color="#B5B7C0">
                    {header}
                  </Th>
                ))}
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((row, index) => renderRow(row, index))}
              {compact &&
                data.length < itemsPerPage &&
                Array.from({ length: itemsPerPage - data.length }).map(
                  (_, index) => (
                    <Tr key={`empty-${index}`} height="50px">
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

        {compact ? (
          <Flex
            justifyContent="space-between"
            alignItems="center"
            marginTop={compact ? 0 : 1}
            paddingX="8px"
            width="100%"
          >
            <Button
              onClick={() => onPageChange(currentPage - 1)}
              isDisabled={currentPage === 1}
              leftIcon={<ChevronLeftIcon />}
              variant="ghost"
              size="sm"
            ></Button>
            <Text>
              {" "}
              Página {currentPage} / {totalPages}{" "}
            </Text>
            <Button
              onClick={() => onPageChange(currentPage + 1)}
              isDisabled={currentPage >= totalPages}
              rightIcon={<ChevronRightIcon />}
              variant="ghost"
              size="sm"
            ></Button>
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
              marginTop={2}
              width="100%"
            >
              <Button
                onClick={() => onPageChange(currentPage - 1)}
                isDisabled={currentPage === 1}
                leftIcon={<ChevronLeftIcon />}
                variant="ghost"
              ></Button>
              <Text>
                {" "}
                Página {currentPage}/{totalPages}{" "}
              </Text>
              <Button
                onClick={() => onPageChange(currentPage + 1)}
                isDisabled={currentPage >= totalPages}
                rightIcon={<ChevronRightIcon />}
                variant="ghost"
              ></Button>
            </Flex>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default PaginateStudent;
