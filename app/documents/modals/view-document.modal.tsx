"use client";

import {
  Button,
  Link as ChakraLink,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { DocumentService } from "../../../services/document-service";

export type ViewDocumentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  documentId: string | null;
  onDeleted?: () => void;
};

const ViewDocumentModal: React.FC<ViewDocumentModalProps> = ({
  isOpen,
  onClose,
  documentId,
}) => {
  const [document, setDocument] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      if (!documentId) return;
      setLoading(true);
      try {
        const res = await DocumentService.getDocumentById(documentId);
        setDocument(res);
      } catch (err) {
        toast({ title: "Error cargando documento", status: "error" });
      } finally {
        setLoading(false);
      }
    };
    if (isOpen) load();
  }, [documentId, isOpen, toast]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Ver Documento</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {document ? (
            <VStack align="stretch">
              <Text fontWeight="bold">{document.name}</Text>
              <Text>{document.description}</Text>
              <Text fontSize="sm" color="gray.500">{new Date(document.createdAt).toLocaleString()}</Text>
              {document.url && (
                <ChakraLink href={document.url} isExternal color="blue.500">{document.url}</ChakraLink>
              )}
            </VStack>
          ) : (
            <Text>Cargando...</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewDocumentModal;
