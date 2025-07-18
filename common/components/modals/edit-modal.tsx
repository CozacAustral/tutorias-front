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


  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent maxW="51vw" maxH="95vh">
        <Text fontSize="50px" color='black' marginTop='30px' marginLeft={8} marginBottom={1}>
          Editar {entityName}
        </Text>
        <ModalCloseButton />
        <ModalBody paddingY={6}>
          <VStack spacing={4} align='stretch'>
            <HStack spacing={4} width='100%'>
              <FormControl>
                <FormLabel>Apellido/s</FormLabel>
                <Input
                  name="lastName"
                  type="text"
                  borderColor="light_gray"
                  bg="light_gray"
                  borderWidth="4px"
                  borderRadius="15px"
                  h="50px"
                  value={formData.lastName}
                  onChange={onInputChange}
                  placeholder="Apellido/s del alumno seleccionado"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input
                  name="name"
                  type="text"
                  borderColor="light_gray"
                  bg="light_gray"
                  borderWidth="4px"
                  borderRadius="15px"
                  h="50px"
                  value={formData.name}
                  onChange={onInputChange}
                  placeholder="Nombre del alumno seleccionado"
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
                />
              </FormControl>
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

          <Box mt={3}>
            <GenericTable
              data={formData.careers}
              TableHeader={['Carrera', 'Estado', 'Año de ingreso']}
              caption="Carreras"
              renderRow={renderCareerNow}
              compact={true}
              itemsPerPage={2}
              showAddMenu={true}
              minH='undefined'
              paddingX={3}
              paddingY={3}
              fontSize="50px"
              marginLeft="3px"
              marginTop="1"
              width="100%"
              maxWidth="100%"
              padding={2}
              flex='undefined'
              height="260px"
            />
          </Box>
        </ModalBody>

        <ModalFooter justifyContent='flex-end' pt={2}>
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
