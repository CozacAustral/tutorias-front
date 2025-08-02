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
      minH={minH ? minH : "auto"}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      width="100%"
      paddingX={paddingX ? paddingX : "16px"}
      paddingY={paddingY ? paddingY : "16px"}
      paddingLeft="160px"
    >
      <Box width="100%" maxWidth={maxWidth ? maxWidth : "95vw"} mb={4}>
        <Text
          fontSize={fontSize ? fontSize : "5xl"}
          marginLeft={marginLeft ? marginLeft : "35px"}
          marginTop={marginTop ? marginTop : "10px"}
          marginBottom="5px"
          color='black'
        >
          {caption}
        </Text>
      </Box>
      <Box
        alignSelf="center"
        width={width ? width : "100%"}
        maxWidth={maxWidth ? maxWidth : "95vw"}
        backgroundColor="white"
        borderRadius="20px"
        padding={padding ? padding : "16px"}
        display="flex"
        flexDirection="column"
        flex={flex ? flex : "0 1 auto"}
        height={height ? height : "auto"}
      >
        {caption && (
          <Flex mb={8} alignItems="center" justifyContent="flex-end" gap="25px" maxWidth="80vw">
            <Box>
              <Search
              onSearch={(term) => {
                onSearch?.(term);
              }}
              />
            </Box>
    
            <Box width="200px">
              <Menu>
              <MenuButton as={InputGroup} width="100%">
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
                      orderBy[1] === option.direction ? "gray.100" : "white"
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
            </Box>
          
            <Box>
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
            </Box>
          </Flex>
        )}
        <TableContainer marginBottom={4} width="100%" maxWidth="1100px" overflowY="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                {TableHeader.map((header, index) => (
                  <Th key={index} fontWeight={500} color="#B5B7C0" py={2}>
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
            >
            </Button>
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
