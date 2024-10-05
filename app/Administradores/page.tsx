"use client";

import React, { useEffect, useState } from "react";
import GenericTable from "../../common/components/generic-table";

import { IconButton, Td, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { User, UserService } from "../../services/admin-service";
import EditModal from "../../common/components/modals/edit-modal";
import CreateModal from "../../common/components/modals/create-modal";

const Administradores: React.FC = () => {
  const [admins, setAdmins] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<User | null>(null);
  const toast = useToast();

  //Create Admin
  const {
    isOpen: isCreateModalOpen,
    onOpen: openCreateModal,
    onClose: closeCreateModal,
  } = useDisclosure();
  const [newFormData, setNewFormData] = useState({
    email: " ",
    name: " ",
    lastName: " ",
    departmentId: 1,
    roleId: 1,
  });

  const handleCreateConfirm = async () => {
    try {
      await UserService.createAdmin(newFormData);
      setAdmins((prev) => (prev ? [...prev, newFormData] : [newFormData])); //Como llamar al Id y usar la contrasena
      toast({
        title: "Administrador creado.",
        description: "El administrador ha sido creado con éxito.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      closeCreateModal();
    } catch (error) {}
  };

  //Termina Create Admin

  //Edit Admin
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData ||
      setNewFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
  };

  const {
    isOpen: isEditModalOpen,
    onOpen: openEditModal,
    onClose: closeEditModal,
  } = useDisclosure();
  const [formData, setFormData] = useState({
    name: " ",
    lastName: " ",
    departmentId: 1,
  });
  const handleEditClick = (user: User) => {
    setSelectedAdmin(user);
    setFormData({
      name: user.name,
      lastName: user.lastName,
      departmentId: 1,
    });
    openEditModal();
  };

  const handleEditConfirm = async () => {
    if (selectedAdmin) {
      console.log(formData);
      try {
        await UserService.updateAdmin(selectedAdmin.id, formData);
        setAdmins(
          admins?.map((user) =>
            user.id === selectedAdmin.id ? { ...user, ...formData } : user
          ) || []
        );
        toast({
          title: "Administrador actualizado.",
          description: "El administrador ha sido actualizado con éxito.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        closeEditModal();
      } catch (err) {
        toast({
          title: "Error al actualizar administrador.",
          description: "Hubo un error al intentar actualizar al administrador.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.log(err);
      }
    }
  };
  //Termina Edit Admin
  const TableHeader = ["Nombre", "Apellido/s", "Correo", "Area"];

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await UserService.fetchAllAdmins();
        setAdmins(data);
        console.log(data);
      } catch (err) {
        setError("Failed to load users");
        console.error(err);
      }
    }
    fetchUsers();
  }, []);
  const renderAdminRow = (admin: User) => (
    <Tr key={admin.id}>
      <Td>{admin.name}</Td>
      <Td>{admin.lastName}</Td>
      <Td>{admin.email}</Td>
      <Td>{admin.roleId}</Td>
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
          onClick={() => handleEditClick(admin)}
        />
      </Td>
    </Tr>
  );

  return (
    <>
      {error && <p>{error}</p>}
      {admins ? (
        <GenericTable
          data={admins}
          TableHeader={TableHeader}
          renderRow={renderAdminRow}
          caption="Administradores"
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
        title="Editar Administrador"
        entityName="administrador"
      />
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onConfirm={handleEditConfirm}
        formData={newFormData}
        onInputChange={handleInputChange}
        title="Nuevo Administrador"
        entityName="administrador"
      />
    </>
  );
};

export default Administradores;
