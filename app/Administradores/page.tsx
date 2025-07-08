"use client";

import React, { useEffect, useState } from "react";
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
import GenericCreateModal from "../../common/components/modals/create-modal-admin-tutores";
import EditModal from "../../common/components/modals/edit-modal";

import { UserService } from "../../services/admin-service";
import { User } from "../interfaces/user.interface";
import DeleteModal from "../../common/components/modals/detele-modal";

const Administradores: React.FC = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<Record<string, any>>({});
  const [adminToDelete, setAdminToDelete] = useState<User | null>(null);

  const toast = useToast();

  const TableHeader = ["Nombre", "Apellido/s", "Correo", "Área", "Acciones"];

  const fetchUsers = async () => {
    try {
      const data = await UserService.fetchAllUsers();
      setUsers(data);
    } catch (err) {
      setError("Fallo al cargar los usuarios.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (admin: User) => {
    setEditingUser(admin);
    setEditForm({
      name: admin.name,
      lastName: admin.lastName,
      email: admin.email,
      telephone: (admin as any).telephone, // ← asegurate que 'telephone' existe
      password: "",
    });
    onEditOpen();
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    if (!editingUser) return;

    const { name, lastName, password, telephone } = editForm;

    try {
      await UserService.updateUser({ name, lastName, password, telephone });
      toast({
        title: "Administrador actualizado",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      fetchUsers();
      onEditClose();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "No se pudo actualizar el administrador.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleDeleteClick = (admin: User) => {
    setAdminToDelete(admin);
    onDeleteOpen();
  };

  const handleConfirmDelete = async () => {
    if (!adminToDelete) return;

    try {
      await UserService.deleteUser(adminToDelete.id);
      toast({
        title: "Administrador eliminado",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      fetchUsers();
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
      <Td>{admin.role}</Td>
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

  const adminFields = [
    { name: "name", label: "Nombre", required: true },
    { name: "lastName", label: "Apellido", required: true },
    { name: "email", label: "Correo", type: "email", required: true },
    { name: "telephone", label: "Teléfono", type: "tel", required: true },
    { name: "password", label: "Contraseña", type: "password", required: true },
  ];

  return (
    <>
      {error && <p>{error}</p>}
      <Box px={10} pt={5}>
        {users ? (
          <GenericTable
            data={users}
            TableHeader={TableHeader}
            renderRow={renderAdminRow}
            caption="Administradores"
            topRightComponent={
              <IconButton
                aria-label="Crear administrador"
                icon={<AddIcon />}
                onClick={onOpen}
                backgroundColor="#318AE4"
                color="white"
                borderRadius="50%"
                boxSize="40px"
                _hover={{
                  backgroundColor: "#2563eb",
                }}
              />
            }
          />
        ) : (
          <p>Cargando...</p>
        )}
      </Box>

      <GenericCreateModal
        isOpen={isOpen}
        onClose={onClose}
        onCreateSuccess={fetchUsers}
        title="Administrador"
        fields={adminFields}
        createFn={(data) => UserService.createUser({ ...data, roleId: 1 })}
      />

      <EditModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        onConfirm={handleEditSubmit}
        entityName="Administrador"
        title="Editar Administrador"
        formData={editForm}
        onInputChange={handleEditChange}
        fieldLabels={{
          name: "Nombre",
          lastName: "Apellido",
          email: "Correo",
          telephone: "Teléfono",
          password: "Contraseña",
        }}
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
