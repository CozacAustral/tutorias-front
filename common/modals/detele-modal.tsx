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
} from "@chakra-ui/react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  entityName: string;  // El nombre de la entidad (Tutor, Alumno, Administrador)
  entityDetails: string;  // Detalles del elemento a eliminar, por ejemplo el nombre del tutor
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  entityName,
  entityDetails,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent
      borderRadius="20px"
      >
        <ModalHeader>Eliminar {entityName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="md">
            ¿Estás seguro de que deseas eliminar al {entityName}{" "}
            <Text as="span" fontWeight="bold">
              {entityDetails}
            </Text>
            ?
          </Text>
        </ModalBody>

        <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button  bg="primary" color="white" onClick={onDelete} mr={3}>
            Eliminar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;
