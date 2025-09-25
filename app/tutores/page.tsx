"use client";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  HStack,
  IconButton,
  Td,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import GenericTable from "../../common/components/generic-table";
import DeleteModal from "../../common/components/modals/detele-modal";
import { UserService } from "../../services/admin-service";
import { Tutors } from "./interfaces/create.tutors.interface";
import EditAdminTutores from "./modals/edit-admin-tutores";
import TutorCreateModal from "./modals/tutor-create-modal";

import { useRouter } from "next/navigation";

import { FaUser } from "react-icons/fa";

const Tutores: React.FC = () => {
  const [tutors, setTutors] = useState<Tutors[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTutor, setSelectedTutor] = useState<Tutors | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();

  const {
    isOpen: isCreateOpen,
    onOpen: openCreateModal,
    onClose: closeCreateModal,
  } = useDisclosure();

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

  const [editFormData, setEditFormData] = useState({
    name: "",
    lastName: "",
    telephone: "",
  });

  const [editLoading, setEditLoading] = useState(false);

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const TableHeader = ["Nombre", "Apellido", "Correo", "telefono", "Acciones"];

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
  }, []);

  const handleEditClick = async (tutor: Tutors) => {
    setSelectedTutor(tutor);
    openEditModal(); // abrí el modal ya (podés esperar al fetch si preferís)

    try {
      setEditLoading(true);
      const fullTutor = await UserService.fetchTutorById(tutor.user.id);

      const u = (fullTutor as any).user ?? fullTutor;

      setEditFormData({
        name: u.name ?? tutor.user.name ?? "",
        lastName: u.lastName ?? tutor.user.lastName ?? "",
        telephone: u.telephone ?? tutor.user.telephone ?? "",
      });
    } catch (err) {
      console.error("❌ Error al obtener tutor por id:", err);
      toast({
        title: "Error al cargar datos",
        description: "No se pudieron cargar los datos del tutor.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setEditLoading(false);
    }
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

  const handleCreateClick = () => {
    openCreateModal();
  };

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

  const handleDeleteClick = (tutor: Tutors) => {
    setSelectedTutor(tutor);
    openDeleteModal();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTutor) return;
    try {
      await UserService.deleteTutor(selectedTutor.user.id);

      setTutors(
        (prev) => prev?.filter((u) => u.user.id !== selectedTutor.user.id) || []
      );
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
          showAddMenu={true}
          onCreateOpen={handleCreateClick}
          filter={false}
        />
      )}

      <TutorCreateModal
        isOpen={isCreateOpen}
        onClose={closeCreateModal}
        onCreateSuccess={handleCreateSuccess}
        createFn={createTutorFn}
      />

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
