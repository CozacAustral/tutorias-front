"use client";
import {
  DeleteIcon,
  EditIcon,
  Search2Icon,
  SearchIcon,
  TriangleDownIcon,
} from "@chakra-ui/icons";
import {
  Box,
  ChakraProvider,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { DataRow } from "../data/data";

interface GenericTableProps {
  data: DataRow[];
  caption: string;
}
const GenericTable: React.FC<GenericTableProps> = ({ data, caption }) => {
  return (
    <ChakraProvider>
      <Flex justifyContent="center" alignItems="center" minHeight="100vh">
        <Box width="100%" maxWidth="1200px">
          <Flex mb={4} width="100%">
            <InputGroup width="30%" mr={2}>
              <InputLeftElement pointerEvents="none">
                <Search2Icon color="black" />
              </InputLeftElement>
              <Input placeholder="search" />
            </InputGroup>
            <Menu>
              <MenuButton as={InputGroup} width="30%" mr={2}>
                <Input placeholder="Ordenar por..." readOnly />
                <InputRightElement pointerEvents="none">
                  <TriangleDownIcon color="black" />
                </InputRightElement>
              </MenuButton>
              <MenuList>
                <MenuItem>Option 1</MenuItem>
                <MenuItem>Option 2</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          <TableContainer>
            <Table variant="simple" size="lg">
              <TableCaption>{caption}</TableCaption>
              <Thead>
                <Tr>
                  <Th>Apellido/s</Th>
                  <Th>Nombre</Th>
                  <Th>Correo</Th>
                  <Th>Departamento</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((row, index) => (
                  <Tr key={index}>
                    <Td>{row.last_name}</Td>
                    <Td>{row.name}</Td>
                    <Td>{row.mail}</Td>
                    <Td>{row.department}</Td>
                    <Td>
                      <Flex justifyContent="center">
                        <IconButton
                          icon={<EditIcon boxSize={5} />} // Ajusta el tamaño del ícono
                          aria-label="Edit"
                          mr={6}
                          backgroundColor="white" // Espacio a la derecha
                        />
                        <IconButton
                          icon={<DeleteIcon boxSize={5} />} // Ajusta el tamaño del ícono
                          aria-label="Delete"
                          backgroundColor="white"
                        />
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default GenericTable;
