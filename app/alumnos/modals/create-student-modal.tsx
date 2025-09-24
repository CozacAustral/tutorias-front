"use client";

import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { UserService } from "../../../services/admin-service";
import { CreateStudent } from "../../carrera/interfaces/CreateStudent";
import { Career } from "../interfaces/career.interface";
import { Country } from "../interfaces/country.interface";

interface CreateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: () => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  careers: Career[];
  countries: Country[];
  studentData: CreateStudent;
}

const CreateStudentModal: React.FC<CreateStudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent,
  handleChange,
  careers,
  countries,
  studentData,
}) => {
  const toast = useToast();
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const formattedData = {
        ...studentData,
        birthdate: new Date(studentData.birthdate).toISOString(),
        yearEntry: new Date(studentData.yearEntry).toISOString(),
      };

      await UserService.createStudent(formattedData);
      onAddStudent();

      onClose();
      toast({
        title: "Éxito",
        description: "Estudiante creado exitosamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al crear el estudiante", error);
      toast({
        title: "Error",
        description: "No se pudo crear el estudiante.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent maxW="51vw">
          <ModalHeader>Crear Alumno</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <HStack spacing={4} w="100%">
                <FormControl isRequired mt={4}>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    name="name"
                    type="text"
                    borderColor="light_gray"
                    bg="Very_Light_Gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={studentData.name}
                    onChange={handleChange}
                    placeholder="Escribe el nombre del estudiante"
                    focusBorderColor={error ? "red" : undefined}
                  />
                </FormControl>
                <FormControl isRequired mt={4}>
                  <FormLabel>Apellido</FormLabel>
                  <Input
                    name="lastName"
                    borderColor="light_gray"
                    bg="Very_Light_Gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={studentData.lastName}
                    onChange={handleChange}
                    placeholder="Escribe el apellido del estudiante"
                    focusBorderColor={error ? "red" : undefined}
                  />
                </FormControl>
              </HStack>
            </VStack>

            <VStack spacing={4} align="stretch">
              <HStack spacing={4} w="100%">
                <FormControl isRequired mt={4}>
                  <FormLabel>DNI</FormLabel>
                  <Input
                    name="dni"
                    borderColor="light_gray"
                    bg="Very_Light_Gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={studentData.dni}
                    onChange={handleChange}
                    placeholder="Escribe el DNI del estudiante"
                    focusBorderColor={error ? "red" : undefined}
                  />
                </FormControl>
                <FormControl isRequired mt={4}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    borderColor="light_gray"
                    bg="Very_Light_Gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={studentData.email}
                    onChange={handleChange}
                    placeholder="Escribe el email del estudiante"
                    focusBorderColor={error ? "red" : undefined}
                  />
                </FormControl>
              </HStack>
            </VStack>

            <VStack spacing={4} align="stretch">
              <HStack spacing={4} w="100%">
                <FormControl isRequired mt={4}>
                  <FormLabel>Telefono</FormLabel>
                  <Input
                    type="tel"
                    name="telephone"
                    borderColor="light_gray"
                    bg="Very_Light_Gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={studentData.telephone}
                    onChange={handleChange}
                    placeholder="Ingrese el telefono del estudiante"
                    focusBorderColor={error ? "red" : undefined}
                  />
                </FormControl>
                <FormControl isRequired mt={4}>
                  <FormLabel>Fecha Nacacimiento</FormLabel>
                  <Input
                    name="birthdate"
                    type="date"
                    borderColor="light_gray"
                    bg="Very_Light_Gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={studentData.birthdate}
                    onChange={handleChange}
                    placeholder="Ingrese la fecha de nacimiento del estudiante"
                    focusBorderColor={error ? "red" : undefined}
                  />
                </FormControl>
              </HStack>
            </VStack>

            <VStack spacing={4} align="stretch">
              <HStack spacing={4} w="100%">
                <FormControl isRequired mt={4}>
                  <FormLabel>Direccion</FormLabel>
                  <Input
                    name="address"
                    borderColor="light_gray"
                    bg="Very_Light_Gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={studentData.address}
                    onChange={handleChange}
                    placeholder="Ingrese la direccion del estudiante"
                    focusBorderColor={error ? "red" : undefined}
                  />
                </FormControl>
                <FormControl isRequired mt={4}>
                  <FormLabel>Año de ingreso</FormLabel>
                  <Input
                    name="yearEntry"
                    type="date"
                    borderColor="light_gray"
                    bg="Very_Light_Gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={studentData.yearEntry}
                    onChange={handleChange}
                    placeholder="Ingrese el año de ingreso del estudiante"
                    focusBorderColor={error ? "red" : undefined}
                  />
                </FormControl>
              </HStack>
            </VStack>

            <VStack spacing={4} align="stretch">
              <HStack spacing={4} w="100%">
                <FormControl isRequired mt={4}>
                  <FormLabel>País</FormLabel>
                  <Select
                    name="countryId"
                    borderColor="light_gray"
                    bg="Very_Light_Gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={studentData.countryId}
                    onChange={handleChange}
                  >
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Carrera</FormLabel>
                  <Select
                    name="careerId"
                    borderColor="light_gray"
                    bg="Very_Light_Gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={studentData.careerId}
                    onChange={handleChange}
                  >
                    {careers.map((career) => (
                      <option key={career.id} value={career.id}>
                        {career.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>
            </VStack>
            <FormControl isRequired mt={4}>
              <FormLabel>Observaciones</FormLabel>
              <Input
                type="text"
                name="observations"
                borderColor="light_gray"
                bg="Very_Light_Gray"
                borderWidth="4px"
                borderRadius="15px"
                w="100%"
                h="50px"
                value={studentData.observations}
                onChange={handleChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              mr={3}
              type="submit"
              onClick={handleSubmit}
            >
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateStudentModal;
