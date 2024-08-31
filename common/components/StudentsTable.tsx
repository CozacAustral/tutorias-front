"use client";
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
  ViewIcon,
  EditIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import Pagination from "./Pagination";
import { DataRow } from "../Data/StudentsData";

interface GenericTableProps {
  data: DataRow[];
  caption: string;
}

const StudentsTable: React.FC<GenericTableProps> = ({ data, caption }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const selectedData = data.slice(startIndex, startIndex + rowsPerPage);

  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <ChakraProvider>
      <Flex
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
        mt="-20"
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
                  <Th fontWeight={600} color="#B5B7C0">
                    Apellido/s
                  </Th>
                  <Th fontWeight={600} color="#B5B7C0">
                    Nombre
                  </Th>
                  <Th fontWeight={600} color="#B5B7C0">
                    Num. Celular
                  </Th>
                  <Th fontWeight={600} color="#B5B7C0">
                    Correo
                  </Th>
                  <Th fontWeight={600} color="#B5B7C0">
                    Carrera
                  </Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody overflow={"auto"} maxHeight="1500px">
                {selectedData.map((row, index) => (
                  <Tr key={index}>
                    <Td>{row.last_name}</Td>
                    <Td>{row.name}</Td>
                    <Td>{row.cellphone_number}</Td>
                    <Td>{row.mail}</Td>
                    <Td minWidth={300}>{row.career}</Td>
                    <Td>
                      <Flex justifyContent="center">
                        <IconButton
                          icon={<ViewIcon boxSize={5} />}
                          aria-label="View"
                          backgroundColor="white"
                          mr={5}
                          _hover={{
                            borderRadius: 15,
                            backgroundColor: "#318AE4",
                            color: "White",
                          }}
                        />
                        <IconButton
                          icon={<EditIcon boxSize={5} />}
                          aria-label="Edit"
                          mr={5}
                          backgroundColor="white"
                          _hover={{
                            borderRadius: 15,
                            backgroundColor: "#318AE4",
                            color: "White",
                          }}
                        />
                        <IconButton
                          icon={<DeleteIcon boxSize={5} />}
                          aria-label="Delete"
                          backgroundColor="white"
                          _hover={{
                            borderRadius: 15,
                            backgroundColor: "#318AE4",
                            color: "White",
                          }}
                        />
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onFirstPage={handleFirstPage}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            onLastPage={handleLastPage}
          />
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default StudentsTable;
