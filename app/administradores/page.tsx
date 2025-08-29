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
import EditModal from "../../common/components/modals/edit-modal";

const Administradores: React.FC = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { collapsed } = useSidebar();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [formMode, setFormMode] = useState<"create" | "edit">("create");
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
  const [admins, setAdmins] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);
  const TableHeader = ["Nombre", "Apellido/s", "Correo", "Acciones"];

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      lastName: "",
      email: "",
      password: "",
      telephone: "",
    });
    setEditingUserId(null);
    setFormMode("create");
  };

  const handleSubmit = async () => {
    try {
      if (formMode === "create") {
        await UserService.createUser({ ...formData, roleId: 1 });
        toast({
          title: "Administrador creado",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      } else if (formMode === "edit" && editingUserId !== null) {
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
      }
      fetchAdminUsers(currentPage, itemsPerPage);
      onClose();
      resetForm();
    } catch (err) {
      toast({
        title: "Error",
        description: "Operación fallida",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      console.error(err);
    }
  };

  const handleCreateClick = () => {
    setFormMode("create");
    resetForm();
    onOpen();
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
      setFormMode("edit");
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
            data={users}
            TableHeader={TableHeader}
            renderRow={renderAdminRow}
            caption="Administradores"
            showPagination={true}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={total}
            onPageChange={(page) => fetchAdminUsers(page, itemsPerPage)}
            topRightComponent={
              <IconButton
                aria-label="Crear administrador"
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
        ) : (
          <p>Cargando...</p>
        )}
      </Box>

      <EditModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          resetForm();
        }}
        onConfirm={handleSubmit}
        title={
          formMode === "edit" ? "Editar Administrador" : "Crear Administrador"
        }
        entityName="Administrador"
        formData={formData}
        onInputChange={handleChange}
        fieldLabels={{
          name: "Nombre",
          lastName: "Apellido",
          email: "Correo",
          telephone: "Teléfono",
          password: formMode === "edit" ? "Cambiar contraseña" : "Contraseña",
        }}
        excludeFields={formMode === "edit" ? ["email"] : []}
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
