"use client";
import React, { useEffect, useState } from "react";
import GenericTable from "../../common/components/generic-table";
import { IconButton, Td, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";

import DeleteModal from "../../common/components/modals/detele-modal";
import EditModal from "../../common/components/modals/edit-modal";
import AssignedStudentsModal from "../../common/components/modals/assigned-students-modal";
import TutorCreateModal from "../../common/components/modals/tutor-create-modal";

import { UserService } from "../../services/admin-service";
import { ResponseTutor } from "../interfaces/response-tutor.interface";
import { Student } from "../interfaces/student.interface";

const Tutores: React.FC = () => {
  const [tutors, setTutors] = useState<ResponseTutor[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTutor, setSelectedTutor] = useState<ResponseTutor | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();

  const [studentsModalOpen, setStudentsModalOpen] = useState(false);
  const [studentsModalLoading, setStudentsModalLoading] = useState(false);
  const [studentsOfTutor, setStudentsOfTutor] = useState<Student[] | null>(
    null
  );
  const [studentsTutorName, setStudentsTutorName] = useState<string>("");
  const [studentsTutorId, setStudentsTutorId] = useState<number | null>(null);

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
  const {
    isOpen: isCreateModalOpen,
    onOpen: openCreateModal,
    onClose: closeCreateModal,
  } = useDisclosure();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const TableHeader = ["Nombre", "Apellido", "Correo"];

  const loadTutors = async () => {
    try {
      const fetchedTutors = await UserService.fetchAllTutors();
      setTutors(fetchedTutors);
    } catch (error) {
      console.error("Error fetching tutors:", error);
      setError("No se pudieron cargar los tutores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTutors();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenStudentsModal = async (tutor: ResponseTutor) => {
    setStudentsModalOpen(true);
    setStudentsModalLoading(true);
    setStudentsTutorName(`${tutor.user.name} ${tutor.user.lastName}`);
    setStudentsTutorId(tutor.user.id);
    try {
      const data = await UserService.getStudentsByTutor(tutor.user.id);
      setStudentsOfTutor(data);
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los estudiantes.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setStudentsOfTutor(null);
    } finally {
      setStudentsModalLoading(false);
    }
  };

  const handleEditClick = (tutor: ResponseTutor) => {
    setSelectedTutor(tutor);
    setFormData({
      name: tutor.user.name,
      email: tutor.user.email,
    });
    openEditModal();
  };

  const handleEditConfirm = async () => {
    if (selectedTutor) {
      try {
        await UserService.updateTutor(selectedTutor.user.id, {
          user: formData,
        });
        await loadTutors();
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

  const handleDeleteClick = (tutor: ResponseTutor) => {
    setSelectedTutor(tutor);
    openDeleteModal();
  };

  const handleDeleteConfirm = async () => {
    if (selectedTutor) {
      try {
        await UserService.deleteTutor(selectedTutor.user.id);
        setTutors(
          tutors?.filter((t) => t.user.id !== selectedTutor.user.id) || []
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

  const renderStudentRow = (tutor: ResponseTutor) => (
    <Tr key={tutor.user.id}>
      <Td>{tutor.user.name}</Td>
      <Td>{tutor.user.lastName}</Td>
      <Td>{tutor.user.email}</Td>
      <Td>
        <IconButton
          icon={<EditIcon boxSize={5} />}
          aria-label="Editar"
          mr={3}
          backgroundColor="white"
          _hover={{
            borderRadius: 15,
            backgroundColor: "#318AE4",
            color: "White",
          }}
          onClick={() => handleEditClick(tutor)}
        />
        <IconButton
          icon={<FaUser />}
          aria-label="Ver alumnos"
          mr={3}
          backgroundColor="white"
          _hover={{
            borderRadius: 15,
            backgroundColor: "#318AE4",
            color: "White",
          }}
          onClick={() =>
            router.push(`/alumnos-asignados?tutorId=${tutor.user.id}`)
          }
        />
        <IconButton
          icon={<DeleteIcon boxSize={5} />}
          aria-label="Eliminar"
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
          topRightComponent={
            <IconButton
              icon={<AddIcon />}
              aria-label="Crear tutor"
              backgroundColor="#318AE4"
              color="white"
              borderRadius="50%"
              boxSize="40px"
              _hover={{ backgroundColor: "#2563eb" }}
              onClick={openCreateModal}
            />
          }
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

      <TutorCreateModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onCreateSuccess={loadTutors}
        createFn={UserService.createTutor}
      />

      {studentsTutorId !== null && (
        <AssignedStudentsModal
          isOpen={studentsModalOpen}
          onClose={() => setStudentsModalOpen(false)}
          students={studentsOfTutor}
          isLoading={studentsModalLoading}
          tutorName={studentsTutorName}
          tutorId={studentsTutorId}
        />
      )}
    </>
  );
};

export default Tutores;
