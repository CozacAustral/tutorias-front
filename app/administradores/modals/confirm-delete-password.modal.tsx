"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Stack,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

interface ConfirmDeletePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;

  entityName: string;
  entityDetails: string;

  onConfirm: (password: string) => Promise<void>;
  isLoading?: boolean;
}

const ConfirmDeletePasswordModal: React.FC<ConfirmDeletePasswordModalProps> = ({
  isOpen,
  onClose,
  entityName,
  entityDetails,
  onConfirm,
  isLoading = false,
}) => {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setShow(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setPassword("");
    setShow(false);
    onClose();
  };

  const handleConfirm = async () => {
    const p = password.trim();
    if (!p) return;
    await onConfirm(p);
  };

  const disabled = isLoading || !password.trim();

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent borderRadius="20px">
        <ModalHeader>Eliminar {entityName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <Text fontSize="md">
              ¿Estás seguro de que deseas eliminar al {entityName}{" "}
              <Text as="span" fontWeight="bold">
                {entityDetails}
              </Text>
              ?
            </Text>

            <FormControl>
              <FormLabel>Ingresá tu contraseña para confirmar</FormLabel>
              <InputGroup>
                <Input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  autoFocus
                />
                <InputRightElement>
                  <IconButton
                    aria-label={show ? "Ocultar" : "Mostrar"}
                    icon={show ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShow((s) => !s)}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            bg="primary"
            color="white"
            ml={3}
            onClick={handleConfirm}
            isLoading={isLoading}
            isDisabled={disabled}
          >
            Eliminar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmDeletePasswordModal;
