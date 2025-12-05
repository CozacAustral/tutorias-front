"use client";

import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  IconButton,
  Td,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

import GenericTable from "../../common/components/generic-table";
import DeleteModal from "../../common/components/modals/detele.modal";

import { UserService } from "../../services/admin-service";
import { useSidebar } from "../contexts/SidebarContext";
import EditAdminTutores from "../tutores/modals/edit-admin-tutores.modal";
import { User } from "./interfaces/user.interface";
import GenericCreateModal from "./modals/create-modal-admin";

const Administradores: React.FC = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { collapsed } = useSidebar();

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    telephone: "",
  });
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<User | null>(null);
  const toast = useToast();

  const [total, setTotal] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);

  const TableHeader = [
    "Nombre",
    "Apellido/s",
    "Correo",
    "Teléfono",
    "Acciones",
  ];

  const fetchAdminUsers = async (page: number, items: number) => {
    try {
      const res = await UserService.fetchAdminUsers(page, items);
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

  const resetForm = () => {
    setFormData({
      name: "",
      lastName: "",
      email: "",
      password: "",
      telephone: "",
    });
    setEditingUserId(null);
  };

  const handleCreateClick = () => {
    resetForm();
    onCreateOpen();
  };

  const createFields = [
    { name: "name", label: "Nombre", required: true },
    { name: "lastName", label: "Apellido/s", required: true },
    { name: "email", label: "Correo", type: "email", required: true },
    { name: "password", label: "Contraseña", type: "password", required: true },
    { name: "telephone", label: "Teléfono", required: true },
  ] as const;

  const createFn = async (data: any) => {
    await UserService.createUser({ ...data, roleId: 1 });
  };

  const onCreateSuccess = () => {
    fetchAdminUsers(currentPage, itemsPerPage);
    resetForm();
  };

  const handleEditClick = async (admin: User) => {
    try {
      const fetchedUser = await UserService.fetchUserById(admin.id);
      setFormData({
        name: fetchedUser.name,
        lastName: fetchedUser.lastName,
        email: fetchedUser.email,
        telephone: (fetchedUser as any).telephone || "",
        password: "",
      });
      setEditingUserId(fetchedUser.id);
      onEditOpen();
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

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      if (editingUserId === null) return;
      const { email, ...restData } = formData;
      await UserService.updateUser(editingUserId, {
        ...restData,
        password: formData.password || undefined,
      });
      toast({
        title: "Administrador actualizado",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      fetchAdminUsers(currentPage, itemsPerPage);
      onEditClose();
      resetForm();
    } catch (err) {
      toast({
        title: "Error",
        description: "Operación de edición fallida",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      console.error(err);
    }
  };

  const handleDeleteClick = (admin: User) => {
    setAdminToDelete(admin);
    onDeleteOpen();
  };

  const handleConfirmDelete = async () => {
    if (!adminToDelete) return;
    const password = window.prompt(
      "Ingresá tu contraseña para confirmar la eliminación:"
    );
    if (!password) return;

    try {
      await UserService.deleteUser(adminToDelete.id, password);
      toast({
        title: "Administrador eliminado",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      fetchAdminUsers(currentPage, itemsPerPage);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "No se pudo eliminar al administrador.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setAdminToDelete(null);
      onDeleteClose();
    }
  };

  const renderAdminRow = (admin: User) => (
    <Tr key={admin.id}>
      <Td>{admin.name}</Td>
      <Td>{admin.lastName}</Td>
      <Td>{admin.email}</Td>
      <Td>{(admin as any).telephone ?? (admin as any).phone ?? "-"}</Td>{" "}
      {/* 👈 nueva celda */}
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
            onCreateOpen={handleCreateClick}
            actions={false}
            data={users}
            TableHeader={TableHeader}
            renderRow={renderAdminRow}
            caption="Administradores"
            itemsPerPage={itemsPerPage}
            showAddMenu={true}
            filter={false}
          />
        ) : (
          <p>Cargando...</p>
        )}
      </Box>

      <GenericCreateModal
        isOpen={isCreateOpen}
        onClose={() => {
          onCreateClose();
          resetForm();
        }}
        onCreateSuccess={onCreateSuccess}
        title="Crear Administrador"
        fields={createFields as any}
        createFn={createFn}
        defaultValues={{
          name: "",
          lastName: "",
          email: "",
          password: "",
          telephone: "",
        }}
      />

      <EditAdminTutores
        isOpen={isEditOpen}
        onClose={() => {
          onEditClose();
          resetForm();
        }}
        onConfirm={handleEditSubmit}
        entityName="Administrador"
        title="Editar Administrador"
        formData={{
          name: formData.name,
          lastName: formData.lastName,
          telephone: formData.telephone,
        }}
        onInputChange={handleEditInputChange}
      />

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onDelete={handleConfirmDelete}
        entityName="administrador"
        entityDetails={`${adminToDelete?.name} ${adminToDelete?.lastName}`}
      />
    </>
  );
};

export default Administradores;
