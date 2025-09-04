import React, { ChangeEventHandler, useEffect, useState } from "react";
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
  Td,
  Textarea,
} from "@chakra-ui/react";
import { UserService } from "../../../services/admin-service";
import { Career } from "../../../app/interfaces/career.interface";
import { Country } from "../../../app/interfaces/country.interface";
import { UpdateStudentDto } from "../../../app/interfaces/update-student";
import { SmallAddIcon, TriangleDownIcon } from "@chakra-ui/icons";
import GenericTable from "../generic-table";
import { title } from "process";
import { Student } from "../../../app/interfaces/student.interface";
import { StudentCareer } from "../../../app/interfaces/studentCareer.interface";

interface EditModalProps<t = any> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  entityName: string;
  onConfirm: () => Promise<void>;
  formData: { [key: string]: t };
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  renderCareerNow?: (career: any, index: number) => React.ReactNode;
  fieldLabels?: { [key: string]: string };

  onCreateOpen?: () => void;
  excludeFields?: string[];
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  title,
  entityName,
  onConfirm,
  formData,
  onInputChange,
  renderCareerNow,

  onCreateOpen,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        maxW="80vw"
        maxH="98vh"
        display="flex"
        flexDirection="column"
        padding={0}
      >
        <ModalHeader fontSize="28px" color="black" pl={6} fontWeight="bold">
          Editar {entityName}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody flex="1" display="flex" flexDirection="column" minH={0}>
          <VStack spacing={6} align="stretch" flex="1">
            <HStack spacing={4} align="flex-start">
              <VStack spacing={4} align="stretch" flex={2}>
                <HStack spacing={4} flexWrap="wrap">
                  <FormControl flex={1} minW="200px">
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
                  <FormControl flex={1} minW="200px">
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

                <HStack spacing={4} flexWrap="wrap">
                  <FormControl flex={1} minW="200px">
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
                  <FormControl flex={1} minW="200px">
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
              </VStack>
              <FormControl flex={1} minW="200px">
                <FormLabel>Observaciones</FormLabel>
                <Textarea
                  name="observations"
                  borderColor="light_gray"
                  bg="light_gray"
                  borderWidth="4px"
                  borderRadius="15px"
                  h="145px"
                  value={formData.observations}
                  onChange={onInputChange}
                  py={3}
                  px={4}
                />
              </FormControl>
            </HStack>
{Array.isArray((formData as any).careers) && renderCareerNow && (
            <Box
              width="100%"
              flex="1"
              overflow="hidden"
              display="flex"
              flexDirection="column"
            >
              <GenericTable
                data={(formData as any).careers}
                TableHeader={["Carrera", "Estado", "Año de ingreso"]}
                caption="Carreras"
                renderRow={renderCareerNow}
                onCreateOpen={onCreateOpen}
                compact
                itemsPerPage={2}
                showAddMenu
                isInModal
                careerModalEdit
                minH="auto"
                paddingX={0}
                paddingY={0}
                fontSize="2xl"
                marginLeft="-4"
                marginTop="0"
                width="100%"
                maxWidth="100%"
                padding={0}
                height="100%"
              />
            </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="flex-end" flexShrink={0} pb={3}>
          <Button variant="ghost" onClick={onClose} mr={4}>
            Cancelar
          </Button>
          <Button bg="primary" color="white" onClick={onConfirm}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
