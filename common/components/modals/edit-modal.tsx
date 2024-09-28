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
} from "@chakra-ui/react";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityName: string;
  title: String;
  onConfirm: () => Promise<void>;
  formData: { [key: string]: string };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  entityName,
  formData,
  onInputChange,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize="2xl" fontWeight="bold">
            Editar {entityName}
          </Text>
        </ModalHeader>
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
          <Button colorScheme="blue" onClick={onConfirm} mr={3}>
            Guardar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
