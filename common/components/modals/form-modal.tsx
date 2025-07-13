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

interface FormModalProps<t = any> {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  entityName: string;
  formData: { [key: string]: t };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fieldLabels?: { [key: string]: string };
  mode: "create" | "edit";
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  entityName,
  formData,
  onInputChange,
  fieldLabels,
  mode,
}) => {
  const keys = Object.keys(formData);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent maxW="51vw">
        <ModalHeader>
          <Text fontSize="2xl" fontWeight="bold">
            {mode === "edit" ? `Editar ${entityName}` : `Crear ${entityName}`}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {keys.map((field) => {
            if (mode === "edit" && field === "email") return null; 
            return (
              <FormControl key={field} mt={4}>
                <FormLabel>{fieldLabels?.[field] || field}</FormLabel>
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
            );
          })}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose} mr={3}>
            Cancelar
          </Button>
          <Button bg="primary" color="white" onClick={onConfirm}>
            {mode === "edit" ? "Guardar" : "Crear"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FormModal;
