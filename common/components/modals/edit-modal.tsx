"use client";

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
  Text,
  HStack,
} from "@chakra-ui/react";

interface EditModalProps<t = any> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  entityName: string;
  onConfirm: () => Promise<void>;
  formData: { [key: string]: t };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fieldLabels?: { [key: string]: string };
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
  fieldLabels = {},
  excludeFields = ["email"], 
}) => {
  const keys = Object.keys(formData).filter(
    (key) => !excludeFields.includes(key)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent maxW="51vw">
        <ModalHeader>
          <Text fontSize="2xl" fontWeight="bold">
            {title || `Editar ${entityName}`}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {keys.map((field) => (
            <FormControl key={field} mt={4}>
              <FormLabel>{fieldLabels[field] || field}</FormLabel>
              <Input
                type={
                  typeof formData[field] === "string" &&
                  formData[field].includes("-")
                    ? "date"
                    : "text"
                }
                name={field}
                borderColor="light_gray"
                bg="light_gray"
                borderWidth="4px"
                borderRadius="15px"
                w="100%"
                h="50px"
                value={formData[field] as string | number}
                onChange={onInputChange}
              />
            </FormControl>
          ))}
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
    </Modal>
  );
};

export default EditModal;
