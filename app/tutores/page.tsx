"use client";
import React, { useEffect, useState } from "react";
import GenericTable from "../../common/components/generic-table";
import { IconButton, Td, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import { UserService } from "../../services/admin-service";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import EditModal from "../../common/components/modals/edit-modal"; // (queda aunque no se use)
import DeleteModal from "../../common/components/modals/detele-modal";
import { Tutors } from "../interfaces/create.tutors.interface";
import EditAdminTutores from "./modals/edit-admin-tutores";

const Tutores: React.FC = () => {
  const [tutors, setTutors] = useState<Tutors[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTutor, setSelectedTutor] = useState<Tutors | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [formMode, setFormMode] = useState<"create" | "edit">("edit");

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

  // ► form del modal de edición (name, lastName, telephone)
  const [editFormData, setEditFormData] = useState({
    name: "",
    lastName: "",
    telephone: "",
  });

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

const TableHeader = ["Nombre", "Apellido", "Correo", "Departamento", "Acciones"];


  // ---------- helpers de fetch ----------
  const DEFAULT_QUERY = { currentPage: 1, resultsPerPage: 50 } as const;

  const loadTutors = async () => {
    try {
      const resp = await UserService.fetchAllTutors(DEFAULT_QUERY);
      setTutors(resp.data); // 👈 usamos el array de la respuesta paginada
      setError(null);
    } catch (e) {
      console.error("Error fetching tutors:", e);
      setError("No se pudieron cargar los tutores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTutors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditClick = (tutor: Tutors) => {
    setSelectedTutor(tutor);
    setEditFormData({
      name: tutor.user.name ?? "",
      lastName: tutor.user.lastName ?? "",
      telephone: tutor.user.telephone ?? "",
    });
    openEditModal();
  };

  const handleEditConfirm = async () => {
    if (!selectedTutor) return;
    try {
      await UserService.updateTutor(selectedTutor.user.id, editFormData);

      await loadTutors(); // 👈 recargar usando la nueva API

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

  const handleCreateClick = () => {
    setFormMode("create");
    setSelectedTutor(null);
    setEditFormData({ name: "", lastName: "", telephone: "" });
    openEditModal();
  };

  // (opcional) confirmar creación
  const handleCreateConfirm = async () => {
    try {
      // Ajustá esta llamada a tu servicio real
      await UserService.createTutor(editFormData);
      await loadTutors();
      toast({
        title: "Tutor creado.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      closeEditModal();
    } catch {
      toast({
        title: "Error al crear tutor.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteClick = (tutor: Tutors) => {
    setSelectedTutor(tutor);
    openDeleteModal();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTutor) return;
    try {
      await UserService.deleteTutor(selectedTutor.user.id);

      // Opcional: actualización optimista
      setTutors(
        (prev) => prev?.filter((u) => u.user.id !== selectedTutor.user.id) || []
      );

      // Y luego sync con el back (por si hay efectos colaterales)
      await loadTutors();

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

  const renderStudentRow = (tutor: Tutors) => (
    <Tr key={tutor.user.id}>
      <Td>{tutor.user.name}</Td>
      <Td>{tutor.user.lastName}</Td>
      <Td>{tutor.user.email}</Td>
      <Td>{tutor.department?.name ?? tutor.category ?? "-"}</Td>
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
      {loading && !tutors ? (
        <p>Loading...</p>
      ) : (
        <GenericTable
          data={tutors || []}
          TableHeader={TableHeader}
          caption="Tutores"
          actions={false}
          renderRow={renderStudentRow}
          topRightComponent={
            <IconButton
              aria-label="Crear tutor"
              icon={<AddIcon />}
              onClick={handleCreateClick}
              backgroundColor="#318AE4"
              color="white"
              borderRadius="50%"
              boxSize="40px"
              _hover={{ backgroundColor: "#2563eb" }}
            />
          }
        />
      )}

      <EditAdminTutores
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onConfirm={handleEditConfirm}
        entityName="tutor"
        title="Editar Tutor"
        formData={editFormData}
        onInputChange={handleEditInputChange}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDeleteConfirm}
        entityName="tutor"
        entityDetails={
          selectedTutor
            ? `${selectedTutor.user.name} ${selectedTutor.user.lastName}`
            : ""
        }
      />
    </>
  );
};

export default Tutores;
