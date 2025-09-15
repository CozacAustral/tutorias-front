
"use client";
import React, { useEffect, useState } from "react";
import GenericTable from "../../common/components/generic-table";
import {
  HStack,
  IconButton,
  Td,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { UserService } from "../../services/admin-service";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import DeleteModal from "../../common/components/modals/detele-modal";
import { Tutors } from "../interfaces/create.tutors.interface";
import EditAdminTutores from "./modals/edit-admin-tutores";
import TutorCreateModal from "./modals/tutor-create-modal";

import { useRouter } from "next/navigation"; // ✅ en vez de next/router

import { FaUser } from "react-icons/fa";
import { ResponseTutor } from "../interfaces/response-tutor.interface";
import page from "../page";

const Tutores: React.FC = () => {
  const [tutors, setTutors] = useState<Tutors[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTutor, setSelectedTutor] = useState<Tutors | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const router = useRouter(); // ✅ instancia del router del App Router

  // MODAL CREAR
  const {
    isOpen: isCreateOpen,
    onOpen: openCreateModal,
    onClose: closeCreateModal,
  } = useDisclosure();

  // MODAL EDITAR
  const {
    isOpen: isEditModalOpen,
    onOpen: openEditModal,
    onClose: closeEditModal,
  } = useDisclosure();

  // MODAL ELIMINAR
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

  const TableHeader = [
    "Nombre",
    "Apellido",
    "Correo",
    "Departamento",
    "Acciones",
  ];

  // ---------- helpers de fetch ----------
  const DEFAULT_QUERY = { currentPage: 1, resultsPerPage: 50 } as const;

  const loadTutors = async () => {
    try {
      const resp = await UserService.fetchAllTutors(DEFAULT_QUERY);
      setTutors(resp.data);
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

  // --------- EDIT ---------
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

  // --------- CREATE (usa TutorCreateModal) ---------
  const handleCreateClick = () => {
    openCreateModal();
  };

  // `TutorCreateModal` ya empaqueta los datos como { user: {..., roleId: 2 } }
  const createTutorFn = async (payload: {
    user: {
      email: string;
      password: string;
      name: string;
      lastName: string;
      roleId: number;
    };
  }) => {
    await UserService.createTutor(payload);
  };

  const handleCreateSuccess = () => {
    loadTutors();
  };

  // --------- DELETE ---------
  const handleDeleteClick = (tutor: Tutors) => {
    setSelectedTutor(tutor);
    openDeleteModal();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTutor) return;
    try {
      await UserService.deleteTutor(selectedTutor.user.id);

      // Optimista
      setTutors(
        (prev) => prev?.filter((u) => u.user.id !== selectedTutor.user.id) || []
      );
      // Sync
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

  const renderTutorRow = (tutor: Tutors) => (
    <Tr key={tutor.user.id}>
      <Td>{tutor.user.name}</Td>
      <Td>{tutor.user.lastName}</Td>
      <Td>{tutor.user.email}</Td>
      <Td>{tutor.user.telephone}</Td>
      <Td>
        <HStack spacing={5}>
          <IconButton
            icon={<EditIcon boxSize={5} />}
            aria-label="Editar"
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
            backgroundColor="white"
            _hover={{
              borderRadius: 15,
              backgroundColor: "#318AE4",
              color: "White",
            }}
            onClick={() => {
              router.push(
                `/alumnos-asignados?tutorId=${tutor.user.id}&fromPage=1`
              );
            }}
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
        </HStack>
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
          renderRow={renderTutorRow}
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

      {/* CREAR TUTOR */}
      <TutorCreateModal
        isOpen={isCreateOpen}
        onClose={closeCreateModal}
        onCreateSuccess={handleCreateSuccess}
        createFn={createTutorFn}
      />

      {/* EDITAR TUTOR */}
      <EditAdminTutores
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onConfirm={handleEditConfirm}
        entityName="tutor"
        title="Editar Tutor"
        formData={editFormData}
        onInputChange={handleEditInputChange}
      />

      {/* ELIMINAR TUTOR */}
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
