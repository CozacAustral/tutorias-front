"use client";

import {
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { GenericCreateModalProps } from "../interfaces/create-modal.interface";


const GenericCreateModal: React.FC<GenericCreateModalProps> = ({
  isOpen,
  onClose,
  onCreateSuccess,
  title,
  fields,
  createFn,
  defaultValues = {},
}) => {
  const toast = useToast();

  const [formData, setFormData] = useState<Record<string, any>>(
    fields.reduce((acc, field) => {
      acc[field.name] = defaultValues[field.name] || "";
      return acc;
    }, {} as Record<string, any>)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createFn(formData);
      toast({
        title: `${title} creado con éxito.`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      onCreateSuccess();
      onClose();
      setFormData(
        fields.reduce((acc, field) => {
          acc[field.name] = defaultValues[field.name] || "";
          return acc;
        }, {} as Record<string, any>)
      );
    } catch (err) {
      console.error("Error al crear", err);
      toast({
        title: "Error",
        description: `No se pudo crear el ${title.toLowerCase()}.`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> {title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {fields.map((field) => (
              <FormControl isRequired={field.required} key={field.name}>
                <FormLabel>{field.label}</FormLabel>
                <Input
                  name={field.name}
                  type={field.type || "text"}
                  placeholder={field.label}
                  value={formData[field.name]}
                  onChange={handleChange}
                />
              </FormControl>
            ))}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            {title.toLowerCase().includes("editar") ? "Guardar" : "Crear"}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GenericCreateModal;
