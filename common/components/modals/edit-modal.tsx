import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  HStack,
  useToast,
  Select,
  VStack,
  TableContainer,
  Table,
  MenuButton,
  Menu,
  InputRightElement,
  InputGroup,
  MenuItem,
  MenuList,
  IconButton,
  Thead,
  Tr,
  Th,
  Tbody,
  Box,
  Td
} from "@chakra-ui/react";
import { UserService } from "../../../services/admin-service";
import { Career } from "../../../app/interfaces/career.interface";
import { Country } from "../../../app/interfaces/country.interface";
import { UpdateStudentDto } from "../../../app/interfaces/update-student";
import { SmallAddIcon, TriangleDownIcon } from "@chakra-ui/icons";
import GenericTable from "../generic-table";
import { title } from "process";
import { Student } from "../../../app/interfaces/student.interface";

interface EditModalProps<t = any> {
  isOpen: boolean;
  onClose: () => void;
  entityName: string;
  title: string; 
  onConfirm: () => Promise<void>;
  formData: { [key: string]: t };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  renderCareerNow: (career: any, index: number) => React.ReactNode
  fieldLabels?: { [key: string]: string };
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  entityName,
  formData,
  onInputChange,
  renderCareerNow,
  fieldLabels,
}) => {

  const toast = useToast();

  const [careers, setCareers] = useState<Career[]>([]);
  const [countries, setCountries] = useState<Country[]>([])

 
  useEffect(() => {
    const loadCareers = async () => {
      try {
        const data = await UserService.fetchAllCareers()
        setCareers(data)
      } catch (error) {
        toast({
          title: 'Errro al cargar las carreras',
          status: 'error'
        });
      }
    };

    const loadCountries = async () => {
      try {
        const data = await UserService.fetchAllCountries()
        setCountries(data)
      } catch (error) {
        toast({
          title: 'Error al cargar los paises de los estudiantes',
          status: 'error'
        });
      }
    }
    if (isOpen) {
      loadCountries();
      loadCareers();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent maxW="51vw">
        <ModalHeader>
          <Text fontSize="5xl" color='black' marginTop={6}>
            Editar {entityName}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <HStack spacing={4} width='100%'>
              <FormControl>
                <FormLabel>Apellido/s</FormLabel>
                <Input
                  type="lastname"
                  borderColor="light_gray"
                  bg="light_gray"
                  borderWidth="4px"
                  borderRadius="15px"
                  h="50px"
                  value={formData.lastName}
                  onChange={onInputChange}
                  placeholder="ApelLido/s del alumno seleccionado"
                  isDisabled
                />
              </FormControl>
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input
                  type="name"
                  borderColor="light_gray"
                  bg="light_gray"
                  borderWidth="4px"
                  borderRadius="15px"
                  h="50px"
                  value={formData.name}
                  onChange={onInputChange}
                  placeholder="Nombre del alumno seleccionado"
                  isDisabled
                />
              </FormControl>
            </HStack>
            <HStack spacing={4} width='100%'>
              <FormControl>
                <FormLabel>Correo</FormLabel>
                <Input
                  name="email"
                  type="email"
                  borderColor="light_gray"
                  bg="light_gray"
                  borderWidth="4px"
                  borderRadius="15px"
                  h="50px"
                  value={formData.email}
                  onChange={onInputChange}
                  placeholder="Correo del alumno seleccionado"
                  isDisabled
                />
              </FormControl>
              <FormControl>
                <FormLabel>Nro. De Telefono</FormLabel>
                <Input
                  name="telephone"
                  type="tel"
                  borderColor="light_gray"
                  bg="light_gray"
                  borderWidth="4px"
                  borderRadius="15px"
                  h="50px"
                  value={formData.telephone}
                  onChange={onInputChange}
                  placeholder="Nro. De telefono del alumno seleccionado"
                  isDisabled
                />
              </FormControl>e
            </HStack>
            <FormControl width='100%'>
              <FormLabel>Observaciones</FormLabel>
              <Input
                name="observations"
                type="text"
                borderColor="light_gray"
                bg="light_gray"
                borderWidth="4px"
                borderRadius="15px"
                h="50px"
                value={formData.observations}
                onChange={onInputChange}
              />
            </FormControl>
          </VStack>

          <Box mt={4}>
            <GenericTable
              data={formData.careers}
              TableHeader={['Carrera', 'Estado', 'Año de ingreso']}
              caption="Carreras"
              renderRow={renderCareerNow}
            />
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose} mr={3}>
            Cancelar
          </Button>
          <Button bg="primary" color="white" onClick={onConfirm}>
            Guardar
          </Button>
        </ModalFooter>

      </ModalContent>
    </Modal >
  );
};

export default EditModal;
