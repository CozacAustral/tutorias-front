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
  InputLeftElement,
  InputRightElement,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { SmallAddIcon, Search2Icon, TriangleDownIcon } from "@chakra-ui/icons";
import Pagination from "./Pagination";

interface GenericTableProps<T> {
  data: T[];
  caption: string;
  TableHeader: string[];
  renderRow: (row: T) => React.ReactNode;
  currentPage: number;
  totalPages: number;
  onFirstPage: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;
}

const GenericTable = <T,>({
  data,
  caption,
  TableHeader,
  renderRow,
  currentPage,
  totalPages,
  onFirstPage,
  onPrevPage,
  onNextPage,
  onLastPage,
}: GenericTableProps<T>) => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      width="100%"
      flexDirection="column"
      mt={0}
    >
      <Box width="100%" maxWidth="1200px" mb={4}>
        <Text
          fontSize="6xl"
          color="black"
          marginLeft="-25"
          marginTop="-30"
          marginBottom="3"
        >
          {caption}
        </Text>
      </Box>
      <Box
        width="100%"
        maxWidth="1210px"
        backgroundColor="white"
        borderRadius="20px"
        p={4}
        mt="-25"
      >
        <Flex mb={4} width="100%">
          <InputGroup width="30%" mr={2}>
            <InputLeftElement pointerEvents="none">
              <Search2Icon color="black" />
            </InputLeftElement>
            <Input placeholder="Buscar" />
          </InputGroup>
          <Menu>
            <MenuButton as={InputGroup} width="30%" mr={2}>
              <Input placeholder="Ordenar por..." readOnly />
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
            <MenuButton as={InputGroup} width="30%" mr={2}>
              <Input placeholder="Filtrar por..." readOnly />
              <InputRightElement pointerEvents="none">
                <TriangleDownIcon color="black" />
              </InputRightElement>
            </MenuButton>
            <MenuList>
              <MenuItem>Carrera</MenuItem>
              <MenuItem>Año de Ingreso</MenuItem>
            </MenuList>
          </Menu>

          <Button ml={"auto"}>
            <SmallAddIcon />
          </Button>
        </Flex>
        <TableContainer>
          <Table
            variant="simple"
            size="lg"
            overflowX={"hidden"}
            overflowY={"hidden"}
          >
            <Thead>
              <Tr>
                {TableHeader.map((header, index) => (
                  <Th key={index} fontWeight={600} color="#B5B7C0">
                    {header}
                  </Th>
                ))}
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>{data.map((row, index) => renderRow(row))}</Tbody>
          </Table>
        </TableContainer>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onFirstPage={onFirstPage}
          onPrevPage={onPrevPage}
          onNextPage={onNextPage}
          onLastPage={onLastPage}
        />
      </Box>
    </Flex>
  );
};

export default GenericTable;