"use client";

import {
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
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { DocumentService } from "../../../services/document-service";

export type EditDocumentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  documentId: string | null;
  onUpdated?: () => void;
};

const EditDocumentModal: React.FC<EditDocumentModalProps> = ({
  isOpen,
  onClose,
  documentId,
  onUpdated,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      if (!documentId) return;
      setLoading(true);
      try {
        const res = await DocumentService.getDocumentById(documentId);
        setName(res.name ?? "");
        setDescription(res.description ?? "");
        setUrl(res.url ?? "");
      } catch (err) {
        toast({ title: "Error cargando documento", status: "error" });
      } finally {
        setLoading(false);
      }
    };
    if (isOpen) load();
  }, [documentId, isOpen, toast]);

  const handleSubmit = async () => {
    if (!documentId) return;
    setSubmitting(true);
    try {
      await DocumentService.updateDocument(documentId, {
        name: name.trim(),
        description: description.trim() || undefined,
        url: url.trim() || undefined,
      });
      toast({ title: "Documento actualizado", status: "success" });
      onUpdated?.();
      onClose();
    } catch (err) {
      toast({ title: "Error al actualizar documento", status: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Documento</ModalHeader>
        <ModalCloseButton isDisabled={submitting} />
        <ModalBody>
          <FormControl isRequired mt={2}>
            <FormLabel>Nombre</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              isDisabled={loading}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Descripción</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              isDisabled={loading}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>URL del archivo</FormLabel>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              isDisabled={loading}
              placeholder="https://..."
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <HStack>
            <Button variant="ghost" onClick={onClose} isDisabled={submitting}>
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={submitting}
            >
              Guardar
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditDocumentModal;
