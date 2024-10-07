"use client";
import React, { use, useEffect, useState } from "react";
import GenericTable from "../../common/components/generic-table";
import { IconButton, Td, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import { Tutors, User, UserService } from "../../services/admin-service";
import { DeleteIcon, EditIcon} from "@chakra-ui/icons";
import EditModal from "../../common/components/modals/edit-modal";
import DeleteModal from "../../common/components/modals/detele-modal";

const Tutores: React.FC = () => {
  const [tutors, setTutors] = useState<Tutors[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTutor, setSelectedTutor] = useState<Tutors | null>(null);
  const toast = useToast();
  const [loading, setLoading] = useState(true);

  const {
        isOpen: isEditModalOpen,
        onOpen: openEditModal,
        onClose: closeEditModal,
      } = useDisclosure();
      const {
        isOpen: isDeleteModalOpen,
        onOpen: openDeleteModal,
        onClose: closeDeleteModal,
      } = useDisclosure();
      const [formData, setFormData] = useState({
        name: " ",
        sex: " ",
            });




  const TableHeader = ["Apellido", "Nombre", "Correo", "Departamento"];

  useEffect(() => {
    const loadTutors = async () => {
      try {
        const fetchedTutors = await UserService.fetchAllTutors();
        setTutors(fetchedTutors);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError("No se pudieron cargar los estudiantes.");
      } finally {
        setLoading(false);
      }
    };
  
    loadTutors();
  }, []);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
    
      const handleEditClick = (tutor: Tutors) => {
        setSelectedTutor(tutor);
        setFormData({
          name: tutor.user.name,
          sex: tutor.sex,          
        });
        openEditModal();
      };
    
      
      const handleEditConfirm = async () => {
        if (selectedTutor) {
          try {
            await UserService.updateTutor(selectedTutor.id, formData);
            
            const updateTutors = await UserService.fetchAllTutors();
            setTutors(updateTutors);

            toast({
              title: "Tutor actualizado.",
              description: "El tutor ha sido actualizado con éxito.",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
      
            closeEditModal();

          } catch (err) {
            toast({
              title: "Error al actualizar tutor.",
              description: "Hubo un error al intentar actualizar al tutor.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        }
      };
      
      
      
      
  const handleDeleteClick = (tutor: Tutors) => {
    setSelectedTutor(tutor);
    openDeleteModal();
  };

  const handleDeleteConfirm = async () => {
    if (selectedTutor) {
      try {
        await UserService.deleteTutor(selectedTutor.id);
        setTutors(
          tutors?.filter((user) => user.id !== selectedTutor.id) || []
        );
        toast({
          title: "Tutor eliminado.",
          description: "El tutor ha sido eliminado correctamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        closeDeleteModal();
      } catch (err) {
        toast({
          title: "Error al eliminar tutor.",
          description: "Hubo un error al intentar eliminar al tutor.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };
    

  const renderStudentRow = (tutor: Tutors) => (
    <Tr key={tutor.user.id}>
      <Td>{tutor.user.name}</Td>
      <Td>{tutor.user.lastName}</Td>
      <Td>{tutor.user.email}</Td>
      <Td>{tutor.user.role}</Td>
      <Td>
        <IconButton
          icon={<EditIcon boxSize={5} />}
          aria-label="Edit"
          mr={5}
          backgroundColor="white"
          _hover={{
            borderRadius: 15,
            backgroundColor: "#318AE4",
            color: "White",
          }}
          onClick={() => handleEditClick(tutor)}
        />
        <IconButton
          icon={<DeleteIcon boxSize={5} />}
          aria-label="Delete"
          backgroundColor="white"
          _hover={{
            borderRadius: 15,
            backgroundColor: "#318AE4",
            color: "White",
          }}
          onClick={() => handleDeleteClick(tutor)}
        />
      </Td>
    </Tr>
  );

  return (
    <>
      {error && <p>{error}</p>}
      {tutors ? (
        <GenericTable
          data={tutors}
          TableHeader={TableHeader}
          caption="Tutores"
          renderRow={renderStudentRow}
        />
      ) : (
        <p>Loading...</p>
      )}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onConfirm={handleEditConfirm}
        formData={formData}
        onInputChange={handleInputChange}
        title="Editar Tutor"
        entityName="tutor"
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDeleteConfirm}
        entityName="tutor"
        entityDetails={`${selectedTutor?.user.name} ${selectedTutor?.user.lastName}`}
      />
    </>
  );
};

export default Tutores;
