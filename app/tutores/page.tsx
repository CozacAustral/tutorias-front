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
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { FaUser } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";

import DeleteModal from "../../common/components/modals/detele-modal";
import TutorCreateModal from "../../common/components/modals/tutor-create-modal";
import EditAdminTutores from "../../common/components/modals/edit-admin-tutores";

import { UserService } from "../../services/admin-service";
import { ResponseTutor } from "../interfaces/response-tutor.interface";
import { useSidebar } from "../contexts/SidebarContext";

const Tutores: React.FC = () => {
  const [tutors, setTutors] = useState<ResponseTutor[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTutor, setSelectedTutor] = useState<ResponseTutor | null>(
    null
  );

  const { collapsed } = useSidebar();
  const offset = collapsed ? "6.5rem" : "17rem";

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [totalItems, setTotalItems] = useState(0);
  const totalItemsForUi = Math.max(totalItems, 1);

  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

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


  const [editFormData, setEditFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    telephone: "",
  });

  const TableHeader = ["Nombre", "Apellido", "Correo"];

  const loadTutors = async (p = 1) => {
    try {
      const resp = await UserService.fetchAllTutors({
        currentPage: p,
        resultsPerPage: itemsPerPage,
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

  useEffect(() => {
    const p = Number(searchParams.get("page") || 1);
    loadTutors(p);
  }, [searchParams]);


  const handleEditInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (tutor: ResponseTutor) => {
    setSelectedTutor(tutor);
    setEditFormData({
      name: tutor.user.name || "",
      lastName: tutor.user.lastName || "",
      email: tutor.user.email || "",
      telephone: (tutor as any).telephone || "",
    });
    openEditModal();
  };

  const handleEditConfirm = async () => {
    if (!selectedTutor) return;
    try {
      await UserService.updateTutor(selectedTutor.user.id, {
        user: editFormData,
      }); 
      await loadTutors(page);
      closeEditModal();
    } catch (e) {
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
      await loadTutors(page);
      closeDeleteModal();
    } catch (e) {
    } finally {
      setSelectedTutor(null);
    }
  };
  const renderTutorRow = (tutor: ResponseTutor) => (
    <Tr key={tutor.user.id}>
      <Td>{tutor.user.name}</Td>
      <Td>{tutor.user.lastName}</Td>
      <Td>{tutor.user.email}</Td>
      <Td textAlign="right">
        <HStack spacing={5} justify="flex-end">
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
        </HStack>
      </Td>
    </Tr>
  );

  return (
    <>
      {error && <p>{error}</p>}

      {tutors ? (
        <GenericTable
          caption="Tutores"
          offsetLeft={offset}
          pageTitle="Tutores"
          data={tutors}
          TableHeader={TableHeader}
          renderRow={renderTutorRow}
          showPagination
          currentPage={page}
          itemsPerPage={itemsPerPage}
          totalItems={totalItemsForUi}
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

      {/* ✏️ EDIT (igual a admins, sin contraseña) */}
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
        entityDetails={`${selectedTutor?.user.name} ${selectedTutor?.user.lastName}`}
      />

      <TutorCreateModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onCreateSuccess={() => loadTutors(page)}
        createFn={UserService.createTutor}
      />
    </>
  );
};

export default Tutores;
