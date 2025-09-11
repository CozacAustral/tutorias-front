// common/components/modals/edit-admin-tutores.tsx
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
  Stack,
} from "@chakra-ui/react";

interface EditAdminTutoresProps {
  isOpen: boolean;
  onClose: () => void;
  entityName: string;
  title?: string;
  onConfirm: () => Promise<void>;
  formData: { name: string; lastName: string; telephone: string };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditAdminTutores: React.FC<EditAdminTutoresProps> = ({
  isOpen,
  onClose,
  onConfirm,
  entityName,
  title = "Editar",
  formData,
  onInputChange,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize="2xl" fontWeight="bold">
            {title}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={onInputChange}
                placeholder="Nombre"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Apellido</FormLabel>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={onInputChange}
                placeholder="Apellido"
              />
            </FormControl>

            {/* ⭕️ Teléfono visible en edit */}
            <FormControl>
              <FormLabel>Teléfono</FormLabel>
              <Input
                name="telephone"
                value={formData.telephone}
                onChange={onInputChange}
                placeholder="Teléfono"
              />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={onConfirm}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditAdminTutores;
