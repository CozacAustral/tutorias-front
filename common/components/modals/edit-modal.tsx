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
  SimpleGrid,
} from "@chakra-ui/react";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityName: string; 
  title: string;
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
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent >
        <ModalHeader>
          <Text fontSize="2xl" fontWeight="bold">
            Editar {entityName}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}> {/* aca se cambia el número de columnas */}
            {Object.keys(formData).map((field) => (
              <FormControl key={field} mt={4}>
                <FormLabel>{field}</FormLabel>
                <Input
                  name={field}
                  value={formData[field]}
                  onChange={onInputChange}
                  size="lg" // Tamaño de los inpust depende del tamano del modal
                  bg="light_gray"
                  borderRadius="md" 
                />
              </FormControl>
            ))}
          </SimpleGrid>
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
