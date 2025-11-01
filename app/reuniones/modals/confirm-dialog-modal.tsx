// src/pages/reuniones/components/confirm-dialog.tsx
"use client";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import React from "react";

export type ConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  body?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  leastDestructiveRef?: React.RefObject<HTMLButtonElement | null>;
  confirmColorScheme?: string; 
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar",
  body = "¿Deseás confirmar esta acción?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isLoading = false,
  leastDestructiveRef,
  confirmColorScheme = "blue",
}) => {
  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={leastDestructiveRef as any}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>{body}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={leastDestructiveRef as any} onClick={onClose}>
              {cancelText}
            </Button>
            <Button
              colorScheme={confirmColorScheme}
              onClick={onConfirm}
              ml={3}
              isLoading={isLoading}
            >
              {confirmText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default ConfirmDialog;
