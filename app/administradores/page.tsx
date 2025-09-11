"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  HStack,
  IconButton,
  Td,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";

import GenericTable from "../../common/components/generic-table";
import DeleteModal from "../../common/components/modals/detele-modal";
import GenericCreateModal from "../../common/components/modals/create-modal-admin";
import EditAdminTutores from "../../common/components/modals/edit-admin-tutores";

import { UserService } from "../../services/admin-service";
import { User } from "../interfaces/user.interface";
import { useSidebar } from "../contexts/SidebarContext";

const Administradores: React.FC = () => {
  const [admins, setAdmins] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 🔎 búsqueda/orden (igual que Tutores)
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState<[string, "ASC" | "DESC"] | undefined>(
    undefined
  );

  // 📄 paginado server-like (igual que Tutores)
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // 🧭 layout (sidebar)
  const { collapsed } = useSidebar();
  const offset = collapsed ? "6.5rem" : "17rem";

  // 🧰 modales / toasts
  const toast = useToast();
  const {
    isOpen: isEditOpen,
    onOpen: openEdit,
    onClose: closeEdit,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: openDelete,
    onClose: closeDelete,
  } = useDisclosure();
  const {
    isOpen: isCreateOpen,
    onOpen: openCreate,
    onClose: closeCreate,
  } = useDisclosure();

  // 📝 forms
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<User | null>(null);

  const [createFormData, setCreateFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    telephone: "",
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    lastName: "",
    telephone: "",
  });

  const TableHeader = ["Nombre", "Apellido", "Correo"];

  // 🔁 loader único (mismo patrón que en Tutores)
  const loadAdmins = async (p = 1) => {
    try {
      const apiOrder = orderBy
        ? `${orderBy[0]}:${orderBy[1].toLowerCase()}`
        : undefined;

      // Si tu servicio ya acepta objeto como fetchAllTutors, úsalo así:
      // const res = await UserService.fetchAdminUsers({
      //   search: searchTerm,
      //   orderBy: apiOrder as any,
      //   currentPage: p,
      //   resultsPerPage: itemsPerPage,
      // });

      // Si aún tienes la firma (page, itemsPerPage), adapta temporalmente:
      const res =
        typeof (UserService as any).fetchAdminUsers === "function" &&
        (UserService as any).fetchAdminUsers.length === 2
          ? await UserService.fetchAdminUsers(p, itemsPerPage)
          : await (UserService as any).fetchAdminUsers({
              search: searchTerm,
              orderBy: apiOrder,
              currentPage: p,
              resultsPerPage: itemsPerPage,
            });

      setAdmins(res.data ?? []);
      setTotalItems(res.total ?? res.data?.length ?? 0);
      setItemsPerPage(res.limit ?? itemsPerPage);
      setPage(res.page ?? p);
    } catch (e) {
      console.error("Error fetching admins:", e);
      setError("No se pudieron cargar los administradores.");
    }
  };

  // primer carga + recargas por filtros/orden/paginación
  const calledRef = useRef(false);
  useEffect(() => {
    if (!calledRef.current) {
      calledRef.current = true;
      loadAdmins(1);
      return;
    }
    loadAdmins(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, itemsPerPage, searchTerm, orderBy]);

  // 🧾 handlers de formulario
  const handleCreateChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ➕ crear admin
  const createAdmin = async (data: any) => {
    await UserService.createUser({ ...data, roleId: 1 });
    await loadAdmins(page);
  };

  // ✏️ abrir modal edición con datos
  const handleEditClick = async (admin: User) => {
    try {
      const fetchedUser = await UserService.fetchUserById(admin.id);
      setEditFormData({
        name: fetchedUser.name,
        lastName: fetchedUser.lastName,
        telephone: (fetchedUser as any).telephone || "",
      });
      setEditingUserId(fetchedUser.id);
      openEdit();
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
      await loadAdmins(page);
      closeEdit();
    } catch (err) {
      console.error(err);
    }
  };

  // 🗑️ eliminar
  const handleDeleteClick = (admin: User) => {
    setAdminToDelete(admin);
    openDelete();
  };

  const handleConfirmDelete = async () => {
    if (!adminToDelete) return;
    try {
      await UserService.deleteUser(adminToDelete.id);
      await loadAdmins(page);
    } catch (err) {
    } finally {
      setAdminToDelete(null);
      closeDelete();
    }
  };

  // ↕️ ordenar
  const handleOrderChange = (field: string, direction: "ASC" | "DESC") => {
    setOrderBy([field, direction]);
    setPage(1);
  };

  // 🧱 fila
  const renderAdminRow = (admin: User) => (
    <Tr key={admin.id}>
      <Td>{admin.name}</Td>
      <Td>{admin.lastName}</Td>
      <Td>{admin.email}</Td>
      <Td>
        <HStack spacing={5} justify="center">
          <IconButton
            icon={<EditIcon boxSize={5} />}
            aria-label="Editar"
            backgroundColor="white"
            _hover={{
              borderRadius: 15,
              backgroundColor: "#318AE4",
              color: "White",
            }}
            onClick={() => handleEditClick(admin)}
          />
          <IconButton
            icon={<DeleteIcon boxSize={5} />}
            aria-label="Eliminar"
            backgroundColor="white"
            _hover={{
              borderRadius: 15,
              backgroundColor: "#E53E3E",
              color: "White",
            }}
            onClick={() => handleDeleteClick(admin)}
          />
        </HStack>
      </Td>
    </Tr>
  );

  return (
    <>
      {error && <p>{error}</p>}

      <GenericTable
        /* === layout/estilo igual que Tutores === */
        columnWidths={["22%", "22%", "36%"]}
        cellPx="50px"
        actionsColWidth={200}
        compact
        caption="Administradores"
        offsetLeft={offset}
        data={admins}
        TableHeader={TableHeader}
        renderRow={renderAdminRow}
        /* === paginado/search/orden igual que Tutores === */
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
        /* === botón crear arriba a la derecha === */
        topRightComponent={
          <IconButton
            aria-label="Crear administrador"
            icon={<AddIcon />}
            onClick={openCreate}
            backgroundColor="#318AE4"
            color="white"
            borderRadius="50%"
            boxSize="40px"
            _hover={{ backgroundColor: "#2563eb" }}
          />
        }
      />

      {/* 🛠️ Editar */}
      <EditAdminTutores
        isOpen={isEditOpen}
        onClose={closeEdit}
        onConfirm={handleEditSubmit}
        entityName="administrador"
        title="Editar Administrador"
        formData={editFormData}
        onInputChange={handleEditChange}
      />

      {/* 🗑️ Eliminar */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        onDelete={handleConfirmDelete}
        entityName="administrador"
        entityDetails={`${adminToDelete?.name} ${adminToDelete?.lastName}`}
      />

      {/* ➕ Crear */}
      <GenericCreateModal
        isOpen={isCreateOpen}
        onClose={closeCreate}
        onCreateSuccess={() => loadAdmins(page)}
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
