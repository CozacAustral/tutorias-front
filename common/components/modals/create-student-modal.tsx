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
import { CreateStudent } from "../../../app/interfaces/CreateStudent";

interface CreateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: () => void;
}


const CreateStudentModal: React.FC<CreateStudentModalProps> = ({ isOpen, onClose, onAddStudent })  => {
  const toast = useToast();
  const [studentData, setStudentData] = useState<CreateStudent>({
    name: '',
    lastName: '',
    dni: '',
    email: '',
    telephone: '',
    birthdate: new Date().toISOString(),
    address: '',
    yearEntry: new Date().toISOString(),
    observations: '',
    countryId: 1,
    careerId: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setStudentData((prevData) => ({
      ...prevData,
      [name]: 
        name === "birthdate" || name === "yearEntry" 
          ? new Date(value).toISOString().split('T')[0]  
          : name === "careerId" || name === "countryId" 
            ? parseInt(value) 
            : value,
    }));
  };
  

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
          <ModalHeader >Crear Alumno</ModalHeader>
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
                  value={studentData.name}
                  onChange={handleChange}
                  placeholder="Escribe el nombre del estudiante"
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
                defaultValue={studentData.countryId}
                onChange={handleChange}
              >
                <option value={1}>Argentina</option>
                <option value={2}>Brasil</option>
                <option value={3}>Chile</option>
                <option value={4}>Paraguay</option>
              </Select>
            </FormControl>

              <FormControl isRequired>
              <FormLabel>Carrera</FormLabel>
              <Select
                name="careerId"
                borderColor="light_gray"
                bg="Very_Light_Gray"
                borderWidth="4px"
                borderRadius="15px"
                defaultValue={studentData.careerId}
                onChange={handleChange}
              >
                <option value={1}>Administración de Empresas</option>
                <option value={2}>Tecnicatura en Programación</option>
                <option value={3}>Abogacía</option>
              </Select>
            </FormControl>
              </HStack>
              </VStack>
              <FormControl>
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
            <Button colorScheme="blue" mr={3} type="submit" onClick={handleSubmit}>
              Guardar
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateStudentModal;
