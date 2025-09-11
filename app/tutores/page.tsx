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
import { useRouter } from "next/navigation";

import DeleteModal from "../../common/components/modals/detele-modal";
import TutorCreateModal from "../../common/components/modals/tutor-create-modal";
import EditAdminTutores from "../../common/components/modals/edit-admin-tutores";

import { UserService } from "../../services/admin-service";
import { ResponseTutor } from "../interfaces/response-tutor.interface";
import { useSidebar } from "../contexts/SidebarContext";

const Tutores: React.FC = () => {
  const [tutors, setTutors] = useState<ResponseTutor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedTutor, setSelectedTutor] = useState<ResponseTutor | null>(
    null
  );

  // 🔎 búsqueda y orden (igual que Alumnos)
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState<[string, "ASC" | "DESC"] | undefined>(
    undefined
  );

  // 📄 paginado (server-like)
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const { collapsed } = useSidebar();
  const offset = collapsed ? "6.5rem" : "17rem";

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

  const [editFormData, setEditFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    telephone: "",
  });

  const TableHeader = ["Nombre", "Apellido", "Correo"];

  // 🔁 loader ÚNICO con los mismos parámetros que Alumnos
  const loadTutors = async (p = 1) => {
    try {
      const apiOrder = orderBy
        ? `${orderBy[0]}:${orderBy[1].toLowerCase()}`
        : undefined;
      const resp = await UserService.fetchAllTutors({
        search: searchTerm,
        orderBy: apiOrder as any, // backend espera "campo:asc|desc"
        currentPage: p,
        resultsPerPage: itemsPerPage,
      });

      setTutors(resp.data);
      setTotalItems(resp.total);
      setItemsPerPage(resp.limit ?? itemsPerPage);
      setPage(resp.page ?? p);
    } catch (e) {
      console.error("Error fetching tutors:", e);
      setError("No se pudieron cargar los tutores.");
    }
  };

  useEffect(() => {
    loadTutors(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, itemsPerPage, searchTerm, orderBy]);

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
    } catch {}
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
    } catch {
    } finally {
      setSelectedTutor(null);
    }
  };

  const handleOrderChange = (field: string, direction: "ASC" | "DESC") => {
    setOrderBy([field, direction]);
    setPage(1);
  };

  const renderTutorRow = (tutor: ResponseTutor) => (
    <Tr key={tutor.user.id}>
      <Td>{tutor.user.name}</Td>
      <Td>{tutor.user.lastName}</Td>
      <Td>{tutor.user.email}</Td>
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

      <GenericTable
        columnWidths={["22%", "22%", "36%"]} // mismos índices que TableHeader
        cellPx="50px" // aire entre columnas (sube/baja 24–32px)
        actionsColWidth={200}
        compact
        caption="Tutores"
        offsetLeft={offset}
        data={tutors}
        TableHeader={TableHeader}
        renderRow={renderTutorRow}
        /* === Igual que Alumnos === */
        showPagination
        currentPage={page}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={(newPage) => setPage(newPage)}
        searchTerm={searchTerm}
        onSearch={(term) => {
          setSearchTerm(term);
          setPage(1);
        }}
        orderBy={orderBy}
        onOrderChange={handleOrderChange}
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
