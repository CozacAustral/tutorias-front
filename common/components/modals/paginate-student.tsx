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
      minH={minH ? minH : "100vh"}
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      paddingX={paddingX ? paddingX : 4}
      paddingY={paddingY ? paddingY : 4}
    >
      <Box width="100%" maxWidth="1200px" mb={4}>
        <Text
          fontSize={fontSize ? fontSize : "6xl"}
          color="black"
          marginLeft={marginLeft ? marginLeft : "-25"}
          marginTop={marginTop ? marginTop : "7"}
        >
          {caption}
        </Text>
      </Box>
      <Box
        width={width ? width : "100vw"}
        maxWidth={maxWidth ? maxWidth : "1210px"}
        backgroundColor="white"
        borderRadius="20px"
        padding={padding ? padding : 4}
        display="flex"
        flexDirection="column"
        flex={flex ? flex : "1"}
        height={height ? height : undefined}
      >
        {caption && (
          <Flex mb={8} width="100%" flexWrap="wrap" gap="60px">
            {/*Componete busqueda o search */}
            <Search
              onSearch={(term) => {
                onSearch?.(term);
              }}
            />

            <Menu>
              <MenuButton as={InputGroup} width="30%" mr={2}>
                <Input
                  placeholder={getCurrentOrderLabel()}
                  value={getCurrentOrderLabel()}
                  readOnly
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
            <Box ml='250px'>
              {showAddMenu && compact ? (
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Opciones"
                    icon={<SmallAddIcon />}
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
                  />
                  <MenuList>
                    <MenuItem onClick={onCreateOpen}>Agregar Alumno</MenuItem>
                    <MenuItem onClick={onImportOpen}>Importar Alumnos</MenuItem>
                  </MenuList>
                </Menu>
              )}
            </Box>
          </Flex>
        )}
        <TableContainer marginBottom={4} width={widthTable ? 900 : undefined}>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                {TableHeader.map((header, index) => (
                  <Th key={index} fontWeight={600} color="#B5B7C0">
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
                    <Tr key={`empty-${index}`} height="40px">
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
            marginTop={compact ? 0 : 2}
          >
            <Button
              onClick={() => onPageChange(currentPage - 1)}
              isDisabled={currentPage === 1}
              leftIcon={<ChevronLeftIcon />}
              variant="ghost"
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
            ></Button>
          </Flex>
        ) : (
          <Flex
            justifyContent="space-between"
            alignItems="center"
            marginTop={2}
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
        )}
      </Box>
    </Box>
  );
};

export default PaginateStudent;
