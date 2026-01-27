"use client";

import {
  Button,
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
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { DocumentService } from "../../../services/document-service";

export type CreateDocumentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

const CreateDocumentModal: React.FC<CreateDocumentModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    if (!name.trim())
      return toast({ title: "Ingrese un nombre", status: "warning" });
    if (!url.trim())
      return toast({ title: "Ingrese una URL válida", status: "warning" });
    setSubmitting(true);
    try {
      const dto = {
        name: name.trim(),
        description: description.trim() || undefined,
        url: url.trim(),
      };

      await DocumentService.createDocument(dto);
      toast({ title: "Documento creado con éxito.", status: "success" }); 
      onCreated?.();
      onClose();
      setName("");
      setDescription("");
      setUrl("");
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "No se pudo crear el documento.", status: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Agregar Documento</ModalHeader>
        <ModalCloseButton isDisabled={submitting} />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre"
                type="text"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Descripción</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción (opcional)"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>URL del archivo</FormLabel>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                type="text"
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleSubmit}
            isLoading={submitting}
          >
            Crear
          </Button>
          <Button variant="ghost" onClick={onClose} isDisabled={submitting}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateDocumentModal;
