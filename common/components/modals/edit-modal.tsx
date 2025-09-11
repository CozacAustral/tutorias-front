import React from "react";
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
  VStack,
  HStack,
  Textarea,
  Box,
} from "@chakra-ui/react";

import GenericTable from "../generic-table";

interface EditModalProps<t = any> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  entityName: string;
  onConfirm: () => Promise<void>;
  formData: { [key: string]: t };
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;

  renderCareerNow?: (career: any, index: number) => React.ReactNode;
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
        p={0}
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
                      value={(formData as any).lastName}
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
                      value={(formData as any).name}
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
                      value={(formData as any).email}
                      onChange={onInputChange}
                      placeholder="Correo del alumno seleccionado"
                    />
                  </FormControl>

                  <FormControl flex={1} minW="200px">
                    <FormLabel>Nro. de teléfono</FormLabel>
                    <Input
                      name="telephone"
                      type="tel"
                      borderColor="light_gray"
                      bg="light_gray"
                      borderWidth="4px"
                      borderRadius="15px"
                      h="50px"
                      value={(formData as any).telephone}
                      onChange={onInputChange}
                      placeholder="Nro. de teléfono del alumno seleccionado"
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
                  value={(formData as any).observations}
                  onChange={onInputChange}
                  py={3}
                  px={4}
                />
              </FormControl>
            </HStack>

            {Array.isArray((formData as any).careers) && renderCareerNow && (
              <Box width="100%" flex="1" overflow="hidden">
                <GenericTable
                  data={(formData as any).careers}
                  TableHeader={["Carrera", "Estado", "Año de ingreso"]}
                  caption="Carreras"
                  renderRow={renderCareerNow}
                  showAddMenu
                  onCreateOpen={onCreateOpen}
                  compact
                  itemsPerPage={2}
                  /* layout dentro del modal */
                  paddingX={0}
                  paddingY={0}
                  offsetLeft="0"
                  columnWidths={["50%", "25%", "25%"]}
                  actionsColWidth={0}
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
