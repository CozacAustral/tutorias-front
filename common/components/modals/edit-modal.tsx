import {
  Box,
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
  Textarea,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import GenericTable from "../generic-table";

interface EditModalProps<t = any> {
  isOpen: boolean;
  onClose: () => void;
  entityName?: string;
  title?: string;
  onConfirm: () => Promise<void>;
  formData: { [key: string]: t };
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  renderCareerNow: (career: any, index: number) => React.ReactNode;
  fieldLabels?: { [key: string]: string };
  createOpen?: () => void;
  caption?: string;
  forTutor?: boolean;
  isViewModal?: boolean;
  role?: number;
  showButtonCancelSave?: boolean;
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
  createOpen,
  caption,
  forTutor,
  isViewModal = false,
  role,
  showButtonCancelSave,
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
          {caption ? caption : `Editar ${entityName}`}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          paddingY={showButtonCancelSave ? 0 : 4}
          flex="1"
          display="flex"
          flexDirection="column"
          minH={0}
        >
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
                      value={formData.lastName || ""}
                      onChange={isViewModal ? undefined : onInputChange}
                      isReadOnly={isViewModal}
                      placeholder={
                        forTutor
                          ? undefined
                          : "Apellido/s del alumno seleccionado"
                      }
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
                      value={formData.name || ""}
                      onChange={isViewModal ? undefined : onInputChange}
                      isReadOnly={isViewModal}
                      placeholder={
                        forTutor ? undefined : "Nombre del alumno seleccionado"
                      }
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
                      value={formData.email || ""}
                      onChange={isViewModal ? undefined : onInputChange}
                      isReadOnly={isViewModal}
                      placeholder={
                        forTutor ? undefined : "Correo del alumno seleccionado"
                      }
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
                      value={formData.telephone || ""}
                      onChange={isViewModal ? undefined : onInputChange}
                      isReadOnly={isViewModal}
                      placeholder={
                        forTutor
                          ? undefined
                          : "Nro. De telefono del alumno seleccionado"
                      }
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
                  value={formData.observations || ""}
                  onChange={isViewModal ? undefined : onInputChange}
                  isReadOnly={isViewModal}
                  py={3}
                  px={4}
                />
              </FormControl>
            </HStack>

            <Box
              width="100%"
              flex="1"
              overflow="hidden"
              display="flex"
              flexDirection="column"
            >
              <GenericTable
                data={formData.careers || []}
                TableHeader={["Carrera", "Estado", "Año de ingreso"]}
                caption="Carreras"
                renderRow={renderCareerNow}
                onCreateOpen={isViewModal ? undefined : createOpen}
                compact={true}
                filter={false}
                itemsPerPage={2}
                showAddMenu={isViewModal ? false : forTutor ? false : true}
                isInModal={true}
                careerModalEdit={true}
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
          </VStack>
        </ModalBody>

        {showButtonCancelSave ? (
          <ModalFooter justifyContent="flex-end" flexShrink={0} p={2}>
            <Button variant="ghost" onClick={onClose} mr={4}>
              Cancelar
            </Button>
            <Button bg="primary" color="white" onClick={onConfirm}>
              Guardar
            </Button>
          </ModalFooter>
        ) : null}
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
