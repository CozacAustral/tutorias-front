"use client";

import React, { useEffect, useState } from "react";
import GenericTable from "../../common/components/generic-table";

import { IconButton, Td, Tr } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {  UserService } from "../../services/admin-service";
import { User } from "../interfaces/user.interface";

const Administradores: React.FC = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const TableHeader = ["Nombre", "Apellido/s", "Correo", "Area"];

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await UserService.fetchAllAdmins();
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
          mr={5}
          backgroundColor="white"
          _hover={{
            borderRadius: 15,
            backgroundColor: "#318AE4",
            color: "White",
          }}
        />
        <IconButton
        icon={<DeleteIcon boxSize={5}/>}
        aria-label="delete"
        backgroundColor="white"
        _hover={{
          borderRadius: 10,
          backgroundColor: '#318AE4',
          color:"white"
        }}
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
          showAddMenu={true}
          addItemLabel="Administador"
        />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Administradores;
