import React, { useState } from "react";
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
} from "@chakra-ui/react";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: { [key: string]: string }) => Promise<void>;
  formData: { [key: string]: string };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  formData,
  onInputChange,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Crear Nueva</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {Object.keys(formData).map((field) => (
            <FormControl key={field} mt={4}>
              <FormLabel>{field}</FormLabel>
              <Input
                name={field}
                value={formData[field]}
                onChange={onInputChange}
              />
            </FormControl>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button
            bg="blue"
            color="white"
            onClick={() => onCreate(formData)}
            mr={3}
          >
            Crear
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateModal;
