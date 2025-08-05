"use client";
import {
  Button,
  Card,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef } from "react";

const mock = [
  {
    tutor: "Pedro López",
    alumno: "Juan Pérez",
    fecha_hora: "23/09/2024 14:30:00",
    aula: "A1",
    status: true,
  },
  {
    tutor: "Ana Torres",
    alumno: "María Gómez",
    fecha_hora: "24/09/2024 09:15:00",
    aula: "B2",
    status: false,
  },
  {
    tutor: "Luis Martínez",
    alumno: "Luis Martínez",
    fecha_hora: "23/09/2024 11:45:00",
    aula: "A3",
    status: true,
  },
  {
    tutor: "Marta Gómez",
    alumno: "Ana Hernández",
    fecha_hora: "24/09/2024 10:00:00",
    aula: "B4",
    status: true,
  },
  {
    tutor: "Fernando Ruiz",
    alumno: "Carlos Lopez",
    fecha_hora: "23/09/2024 15:20:00",
    aula: "A2",
    status: false,
  },
  {
    tutor: "Clara Martínez",
    alumno: "Lucía Ramírez",
    fecha_hora: "24/09/2024 12:30:00",
    aula: "B1",
    status: true,
  },
];

const Reuniones = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  return (
    <>
      <Heading
        as="h1"
        size="3xl"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="500"
        mt="20px"
        ml="20px"
        zIndex="5"
      >
        Reuniones
      </Heading>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: "8rem",
        }}
      >
        <Button onClick={onOpen}>+ Agregar</Button>
      </div>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agenda una reunión</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Tutor</FormLabel>
              <Select ref={initialRef} placeholder="Seleccionar Tutor">
                {mock.map((i)=>(
                  <option value={i.tutor}>{i.tutor}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Alumno</FormLabel>
              <Select placeholder="Seleccionar alumno">
                {mock.map((i)=>(
                  <option value={i.alumno}>{i.alumno}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Fecha y hora</FormLabel>
              <Input placeholder="DD/MM/AAAA hh:mm" />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Aula</FormLabel>
              <Input placeholder="X0" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Guardar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Card>
        <TableContainer mx="4rem" mt="3rem">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th color="#a0a9b2">Tutor</Th>
                <Th color="#a0a9b2">Alumno</Th>
                <Th color="#a0a9b2">Fecha y hora</Th>
                <Th color="#a0a9b2">Aula</Th>
                <Th color="#a0a9b2">Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mock.map((item) => (
                <Tr>
                  <Td>{item.tutor}</Td>
                  <Td>{item.alumno}</Td>
                  <Td>{item.fecha_hora}</Td>
                  <Td>{item.aula}</Td>
                  <Td>
                    {" "}
                    <Image
                      src={
                        item.status
                          ? "/icons/true-check.svg"
                          : "/icons/false-check.svg"
                      }
                      alt={item.status ? "True" : "False"}
                      width="6"
                      height="6"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
};

export default Reuniones;
