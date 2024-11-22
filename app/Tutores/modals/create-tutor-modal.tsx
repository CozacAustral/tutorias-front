'use client';

import {
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Button,
  FormLabel,
  Input,
  ModalFooter,
  useToast,
  VStack,
  HStack,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import { UserService } from "../../../services/admin-service";
import { format, parseISO } from "date-fns";
import { CreateTutor } from "../../interfaces/create-tutor";

interface CreateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTutor: () => void;
}

const CreateTutorModal: React.FC<CreateStudentModalProps> = ({ isOpen, onClose, onAddTutor })  => {
    const toast = useToast();
    const [tutorData, setTutorData] = useState<CreateTutor>({
    email: '',
    name: '',
    lastName: '',
    sex: '',
    dni: '',
    telephone: '',
    birthdate: new Date().toISOString(),
    yearEntry: new Date().toISOString(),
    observations: '',
    countryId: 1,
    category: '',
    dedication: '',
    dedicationDays: 1,
    departmentId: 1
  });
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setTutorData((prevData) => ({
      ...prevData,
      [name]:
        name === "birthdate" || name === "yearEntry"
          ? format(new Date(value), "yyyy-MM-dd")
          : name === "dedicationDays" || name === "departmentId"  // Aquí se asegura de que sean enteros
          ? parseInt(value, 10) || 0  // Si no es un número válido, se asigna 0
          : value,
    }));
  };
  
  

  const handleSubmit = async () => {
    try {
        const formattedData = {
            ...tutorData,
            birthdate: new Date(tutorData.birthdate).toISOString(),
            yearEntry: new Date(tutorData.yearEntry).toISOString(),
        };
        
      await UserService.createTutor(formattedData);
      onAddTutor();
      onClose();
      toast({
            title: "Éxito",
            description: "Tutor creado exitosamente.",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
    } catch (error) {
        console.error("Error al crear el tutor", error);
        toast({
            title: "Error",
            description: "No se pudo crear el tutor.",
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
          <ModalHeader >Crear Tutor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>

          <VStack spacing={4} align="stretch">
          <HStack spacing={4} w="100%">
              <FormControl isRequired>
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
                  value={tutorData.name}
                  onChange={handleChange}
                  placeholder="Escribe el nombre del tutor"
                />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Apellido</FormLabel>
                <Input
                  name="lastName"
                  type="text"
                  borderColor="light_gray"
                  bg="Very_Light_Gray"
                  borderWidth="4px"
                  borderRadius="15px"
                  w="100%"
                  h="50px"
                  value={tutorData.lastName}
                  onChange={handleChange}
                  placeholder="Escribe el apellido del tutor"
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
                  type="number"
                  borderColor="light_gray"
                  bg="Very_Light_Gray"
                  borderWidth="4px"
                  borderRadius="15px"
                  w="100%"
                  h="50px"
                  value={tutorData.dni}
                  onChange={handleChange}
                  placeholder="Escribe el DNI del tutor"
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
                  value={tutorData.email}
                  onChange={handleChange}
                  placeholder="Escribe el email del tutor"
                />
              </FormControl>
              </HStack>
              </VStack>

              <VStack spacing={4} align="stretch">
              <HStack spacing={4} w="100%">
              <FormControl isRequired mt={4}>
                <FormLabel>Telefono</FormLabel>
                <Input
                type="number"
                  name="telephone"
                  borderColor="light_gray"
                  bg="Very_Light_Gray"
                  borderWidth="4px"
                  borderRadius="15px"
                  w="100%"
                  h="50px"
                  value={tutorData.telephone}
                  onChange={handleChange}
                  placeholder="Ingrese el telefono del tutor"
                />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Fecha Nacimiento</FormLabel>
                <Input
                  name="birthdate"
                  type="date"
                  borderColor="light_gray"
                  bg="Very_Light_Gray"
                  borderWidth="4px"
                  borderRadius="15px"
                  w="100%"
                  h="50px"
                  value={format(new Date(tutorData.birthdate), "yyyy-MM-dd")}
                  onChange={handleChange}
                  placeholder="Ingrese la fecha de nacimiento del tutor"
                />
              </FormControl>
              </HStack>
              </VStack>

              <VStack spacing={4} align="stretch">
              <HStack spacing={4} w="100%">
              <FormControl isRequired mt={4}>
                <FormLabel>Dedicación</FormLabel>
                <Input
                  name="dedication"
                  borderColor="light_gray"
                  bg="Very_Light_Gray"
                  borderWidth="4px"
                  borderRadius="15px"
                  w="100%"
                  h="50px"
                  value={tutorData.dedication}
                  onChange={handleChange}
                  placeholder="Ingrese la dedicación del tutor"
                />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Días dedicación</FormLabel>
                <Input
                  name="dedicationDays"
                  type="number"
                  borderColor="light_gray"
                  bg="Very_Light_Gray"
                  borderWidth="4px"
                  borderRadius="15px"
                  w="100%"
                  h="50px"
                  value={tutorData.dedicationDays}
                  onChange={handleChange}
                  placeholder="Ingrese los días de dedicación del tutor"
                />
              </FormControl>
              </HStack>
              </VStack>

              <VStack spacing={4} align="stretch">
              <HStack spacing={4} w="100%">
              <FormControl isRequired mt={4}>
                <FormLabel>Departamento</FormLabel>
                <Input
                  type="number"
                  name="departmentId"
                  borderColor="light_gray"
                  bg="Very_Light_Gray"
                  borderWidth="4px"
                  borderRadius="15px"
                  w="100%"
                  h="50px"
                  value={tutorData.departmentId}
                  onChange={handleChange}
                  placeholder="Ingrese el departamento del tutor"
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
                  value={tutorData.yearEntry}
                  onChange={handleChange}
                  placeholder="Ingrese el año de ingreso del tutor"
                />
              </FormControl>
              </HStack>
              </VStack>

              <VStack spacing={4} align="stretch">
              <HStack spacing={4} w="100%">
              <FormControl isRequired>
                <FormLabel>País</FormLabel>
                <Select
                  name="countryId"
                  borderColor="light_gray"
                  bg="Very_Light_Gray"
                  borderWidth="4px"
                  borderRadius="15px"
                  defaultValue={tutorData.countryId}
                  onChange={handleChange}
                >
                  <option value={1}>Argentina</option>
                  <option value={2}>Chile</option>
                  <option value={3}>Brasil</option>
                </Select>
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Categoria</FormLabel>
                <Input
                  name="category"
                  type="text"
                  borderColor="light_gray"
                  bg="Very_Light_Gray"
                  borderWidth="4px"
                  borderRadius="15px"
                  w="100%"
                  h="50px"
                  value={tutorData.category}
                  onChange={handleChange}
                  placeholder="Ingrese la categoria del tutor"
                />
              </FormControl>
              </HStack>
              </VStack>
              <VStack spacing={4} align="stretch">
              <HStack spacing={4} w="100%">
              <FormControl isRequired mt={4}>
                <FormLabel>Sexo</FormLabel>
                <Input
                type="text"
                  name="sex"
                  borderColor="light_gray"
                  bg="Very_Light_Gray"
                  borderWidth="4px"
                  borderRadius="15px"
                  w="100%"
                  h="50px"
                  value={tutorData.sex}
                  onChange={handleChange}
                  placeholder="Ingrese el sexo del tutor"
                />
              </FormControl>
              </HStack>
              </VStack>

          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button bg="primary"  color="white"onClick={handleSubmit}>
              Crear Tutor
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateTutorModal;
