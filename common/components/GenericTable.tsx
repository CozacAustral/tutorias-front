"use client";
import {
  DeleteIcon,
  EditIcon,
  Search2Icon,
  SmallAddIcon,
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
  Th,
  Thead,
  Tr,
  Text,
  Button,
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
          maxWidth="1200px"
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
                <MenuItem>Opción 1</MenuItem>
                <MenuItem>Opción 2</MenuItem>
              </MenuList>
            </Menu>
            <Button ml={350}>
              <SmallAddIcon />
            </Button>
          </Flex>
          <TableContainer>
            <Table variant="simple" size="lg">
              <Thead>
                <Tr>
                  <Th fontWeight={600} color="#B5B7C0">
                    Apellido/s
                  </Th>
                  <Th fontWeight={600} color="#B5B7C0">
                    Nombre
                  </Th>
                  <Th fontWeight={600} color="#B5B7C0">
                    Correo
                  </Th>
                  <Th fontWeight={600} color="#B5B7C0">
                    Departamento
                  </Th>
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
                          icon={<EditIcon boxSize={5} />}
                          aria-label="Edit"
                          mr={6}
                          backgroundColor="white"
                        />
                        <IconButton
                          icon={<DeleteIcon boxSize={5} />}
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
