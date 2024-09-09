"use client";

import React, { useEffect, useState } from "react";
import GenericTable from "../../common/components/GenericTable";

import { useQueries } from "@tanstack/react-query";
import { IconButton, Td, Tr } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { User, UserService } from "../../services/AdminService";

const Administradores: React.FC = () => {
  // const { data, isError } = useQueries(["users"], async () =>
  //   UserService.fetchAllUsers()
  // );
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const TableHeader = ["Nombre", "Apellido/s", "Correo", "Area"];

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
          backgroundColor="white"
        />
      </Td>
    </Tr>
  );

  return (
    <>
      {error && <p>{error}</p>}
      {users ? (
        <GenericTable
          data={users}
          TableHeader={TableHeader}
          renderRow={renderAdminRow}
          caption="Administradores"
        />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Administradores;
