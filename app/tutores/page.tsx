"use client";

import React, { useEffect, useState } from "react";
import GenericTable from "../../common/components/generic-table";
import { IconButton, Td, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { FaUser } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";

import DeleteModal from "../../common/components/modals/detele-modal";
import EditModal from "../../common/components/modals/edit-modal";
import TutorCreateModal from "../../common/components/modals/tutor-create-modal";

import { UserService } from "../../services/admin-service";
import { ResponseTutor } from "../interfaces/response-tutor.interface";

const Tutores: React.FC = () => {
  const [tutors, setTutors] = useState<ResponseTutor[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTutor, setSelectedTutor] = useState<ResponseTutor | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7); // o 20, como quieras
  const [totalItems, setTotalItems] = useState(0);

  const totalItemsForUi = Math.max(totalItems, 1);

  const toast = useToast();
  const router = useRouter();

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

  const [formData, setFormData] = useState({ name: "", email: "" });

  const TableHeader = ["Nombre", "Apellido", "Correo"];

  const loadTutors = async (p = 1) => {
    try {
      const resp = await UserService.fetchAllTutors({
        currentPage: p,
        resultsPerPage: itemsPerPage, // usa el state
      });
      setTutors(resp.data);
      setTotalItems(resp.total);
      setItemsPerPage(resp.limit ?? itemsPerPage);
      setPage(resp.page ?? p);
    } catch (error) {
      console.error("Error fetching tutors:", error);
      setError("No se pudieron cargar los tutores.");
    }
  };

  const searchParams = useSearchParams();

  useEffect(() => {
    const p = Number(searchParams.get("page") || 1);
    loadTutors(p);
  }, [searchParams]);

const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
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
    if (!selectedTutor) return;
    try {
      await UserService.updateTutor(selectedTutor.user.id, { user: formData });
      await loadTutors();
      toast({
        title: "Tutor actualizado.",
        description: "El tutor ha sido actualizado con éxito.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      closeEditModal();
    } catch {
      toast({
        title: "Error al actualizar tutor.",
        description: "Hubo un error al intentar actualizar al tutor.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteClick = (tutor: ResponseTutor) => {
    setSelectedTutor(tutor);
    openDeleteModal();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTutor) return;
    try {
      await UserService.deleteTutor(selectedTutor.user.id);
      setTutors(
        (prev) => prev?.filter((t) => t.user.id !== selectedTutor.user.id) || []
      );
      toast({
        title: "Tutor eliminado.",
        description: "El tutor ha sido eliminado correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      closeDeleteModal();
    } catch {
      toast({
        title: "Error al eliminar tutor.",
        description: "Hubo un error al intentar eliminar al tutor.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
            router.push(
              `/alumnos-asignados?tutorId=${tutor.user.id}&fromPage=${page}`
            )
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
          showPagination
          currentPage={page}
          itemsPerPage={itemsPerPage}
          totalItems={totalItemsForUi}
          data={tutors}
          TableHeader={TableHeader}
          caption="Tutores"
          renderRow={renderStudentRow}
          onPageChange={(newPage) => router.push(`/tutores?page=${newPage}`)}
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
    </>
  );
};

export default Tutores;
