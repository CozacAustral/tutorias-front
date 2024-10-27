import { FiUpload } from 'react-icons/fi';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  InputGroup,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { UserService } from '../../../services/admin-service';


interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
        file.type === "application/vnd.ms-excel")) {
      setSelectedFile(file);
      setError(null);
    } else {
      setError("Por favor, selecciona un archivo válido (.xlsx, .xls)");
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImport = async () => {
    if (selectedFile) {
      try {
        await UserService.importStudent(selectedFile);
      } catch (error) {
        console.error('Error en la importación:', error);
        setError('Ocurrió un error al importar el archivo.');
      }
    } else {
      setError("Por favor, selecciona un archivo antes de importar.");
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Importar Alumnos</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p>Suba un archivo para agregar uno o varios alumnos de forma automática</p>
          <InputGroup>
            <Button
              onClick={handleUploadClick}
              leftIcon={<FiUpload />}
              size="md"
              width="100%"
              bg='light_gray'
            >
              {selectedFile ? selectedFile.name : "Elegir archivo"}
            </Button>
            <Input
              ref={fileInputRef}
              type='file'
              accept='.xlsx, .xls'
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </InputGroup>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button bg="primary" color="white" mr={3} onClick={handleImport}>
            Importar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ImportModal;
