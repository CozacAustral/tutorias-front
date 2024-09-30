"use client";

import React, { useEffect, useState } from "react";
import GenericTable from "../../common/components/GenericTable";
import { IconButton, Td, Tr } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { User, UserService } from "../../services/AdminService";

const Administradores: React.FC = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  const TableHeader = ["Nombre", "Apellido/s", "Correo", "Área"];

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await UserService.fetchAllUsers();
        setUsers(data);
        console.log(data);
      } catch (err) {
        setError("Failed to load users");
        console.error(err);
      }
    }
    fetchUsers();
  }, []);

  const totalPages = users ? Math.ceil(users.length / usersPerPage) : 1;

  const handleFirstPage = () => setCurrentPage(1);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleLastPage = () => setCurrentPage(totalPages);

  const renderAdminRow = (admin: User) => (
    <Tr key={admin.id}>
      <Td>{admin.name}</Td>
      <Td>{admin.lastName}</Td>
      <Td>{admin.email}</Td>
      <Td>{admin.role}</Td>
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
        />
      </Td>
    </Tr>
  );

  const paginatedUsers = users
    ? users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)
    : [];

  return (
    <>
      {error && <p>{error}</p>}
      {users ? (
        <GenericTable
          data={paginatedUsers}
          TableHeader={TableHeader}
          renderRow={renderAdminRow}
          caption="Administradores"
          currentPage={currentPage}
          totalPages={totalPages}
          onFirstPage={handleFirstPage}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          onLastPage={handleLastPage}
        />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Administradores;
