"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  Td,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";

import GenericTable from "../../common/components/generic-table";
import DeleteModal from "../../common/components/modals/detele-modal";
import { UserService } from "../../services/admin-service";
import { User } from "../interfaces/user.interface";
import { useSidebar } from "../contexts/SidebarContext";
import GenericCreateModal from "../../common/components/modals/create-modal-admin";
import EditAdminTutores from "../../common/components/modals/edit-admin-tutores";

const Administradores: React.FC = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { collapsed } = useSidebar();
  const offset = collapsed ? "6.5rem" : "17rem";

  const { isOpen, onOpen, onClose } = useDisclosure(); // modal EDIT
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<User | null>(null);
  const toast = useToast();

  const [total, setTotal] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);

  const TableHeader = ["Nombre", "Apellido/s", "Correo"];

  // 🔹 Estado separado para CREATE
  const [createFormData, setCreateFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    telephone: "",
  });

  // 🔹 Estado separado para EDIT
  const [editFormData, setEditFormData] = useState({
    name: "",
    lastName: "",
    telephone: "",
  });

  const fetchAdminUsers = async (page: number, itemsPerPage: number) => {
    try {
      const res = await UserService.fetchAdminUsers(page, itemsPerPage);
      setUsers(res.data);
      setTotal(res.total);
      setItemsPerPage(res.limit);
      setCurrentPage(page);
    } catch (err) {
      setError("Fallo al cargar los usuarios.");
      console.error(err);
    }
  };

  const calledRef = useRef(false);
  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    fetchAdminUsers(1, itemsPerPage);
  }, []);

  // 🔹 Handlers CREATE
  const handleCreateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createAdmin = async (data: any) => {
    await UserService.createUser({ ...data, roleId: 1 });
    await fetchAdminUsers(currentPage, itemsPerPage);
  };

  // 🔹 Handlers EDIT
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = async (admin: User) => {
    try {
      const fetchedUser = await UserService.fetchUserById(admin.id);
      setEditFormData({
        name: fetchedUser.name,
        lastName: fetchedUser.lastName,
        telephone: (fetchedUser as any).telephone || "",
      });
      setEditingUserId(fetchedUser.id);
      onOpen();
    } catch (error) {
      console.error("❌ Error al obtener el usuario por ID:", error);
      toast({
        title: "Error al obtener los datos",
        description: "No se pudo obtener el administrador para editar.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleEditSubmit = async () => {
    if (!editingUserId) return;
    try {
      await UserService.updateUser(editingUserId, editFormData);
      fetchAdminUsers(currentPage, itemsPerPage);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Delete
  const handleDeleteClick = (admin: User) => {
    setAdminToDelete(admin);
    onDeleteOpen();
  };

  const handleConfirmDelete = async () => {
    if (!adminToDelete) return;
    try {
      await UserService.deleteUser(adminToDelete.id);
      fetchAdminUsers(currentPage, itemsPerPage);
    } catch (err) {
    } finally {
      setAdminToDelete(null);
      onDeleteClose();
    }
  };

  // 🔹 Render
  const renderAdminRow = (admin: User) => (
    <Tr key={admin.id}>
      <Td>{admin.name}</Td>
      <Td>{admin.lastName}</Td>
      <Td>{admin.email}</Td>
      <Td>
        <IconButton
          icon={<EditIcon boxSize={5} />}
          aria-label="Editar"
          backgroundColor="white"
          onClick={() => handleEditClick(admin)}
          _hover={{
            borderRadius: 15,
            backgroundColor: "#318AE4",
            color: "white",
          }}
        />
        <IconButton
          icon={<DeleteIcon boxSize={5} />}
          aria-label="Eliminar"
          backgroundColor="white"
          onClick={() => handleDeleteClick(admin)}
          ml={2}
          _hover={{
            borderRadius: 15,
            backgroundColor: "red.500",
            color: "white",
          }}
        />
      </Td>
    </Tr>
  );

  return (
    <>
      {error && <p>{error}</p>}
      <Box pl={collapsed ? "6.5rem" : "17rem"} px={5}>
        {users ? (
          <GenericTable
            offsetLeft={offset}
            data={users}
            TableHeader={TableHeader}
            renderRow={renderAdminRow}
            caption="Administradores"
            pageTitle="Administradores"
            hideToolbarCaption={false}
            showPagination={true}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={total}
            onPageChange={(page) => fetchAdminUsers(page, itemsPerPage)}
            topRightComponent={
              <IconButton
                aria-label="Crear administrador"
                icon={<AddIcon />}
                onClick={onCreateOpen}
                backgroundColor="#318AE4"
                color="white"
                borderRadius="50%"
                boxSize="40px"
                _hover={{ backgroundColor: "#2563eb" }}
              />
            }
          />
        ) : (
          <p>Cargando...</p>
        )}
      </Box>

      <EditAdminTutores
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleEditSubmit}
        entityName="Administrador"
        formData={editFormData}
        onInputChange={handleEditChange}
      />

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onDelete={handleConfirmDelete}
        entityName="administrador"
        entityDetails={`${adminToDelete?.name} ${adminToDelete?.lastName}`}
      />

      <GenericCreateModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onCreateSuccess={() => fetchAdminUsers(currentPage, itemsPerPage)}
        title="Crear administrador"
        fields={[
          { name: "name", label: "Nombre", required: true },
          { name: "lastName", label: "Apellido", required: true },
          { name: "email", label: "Correo", type: "email", required: true },
          { name: "telephone", label: "Teléfono", type: "tel" },
          { name: "password", label: "Contraseña", type: "password", required: true },
        ]}
        createFn={createAdmin}
      />
    </>
  );
};

export default Administradores;
