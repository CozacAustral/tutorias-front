"use client";
import React, { useEffect, useState } from "react";
import GenericTable from "../../common/components/GenericTable";

import { IconButton, Td, Tr } from "@chakra-ui/react";
import { User, UserService } from "../../services/AdminService";
import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";

const Tutores: React.FC = () => {
  const [students, setStudents] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const TableHeader = ["Apellido", "Nombre", "Correo", "Area"];

  useEffect(() => {
    async function fetchStudents() {
      try {
        const data = await UserService.fetchAllUsers();
        setStudents(data);
      } catch (err) {
        setError("Failed to load students");
      }
    }
    fetchStudents();
  }, []);

  const renderStudentRow = (tutor: User) => (
    <Tr key={tutor.id}>
      <Td>{tutor.name}</Td>
      <Td>{tutor.lastName}</Td>
      <Td>{tutor.email}</Td>
      <Td>{tutor.role}</Td>
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
          icon={<DeleteIcon boxSize={5} />}
          aria-label="Delete"
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

  return (
    <>
      {error && <p>{error}</p>}
      {students ? (
        <GenericTable
          data={students}
          TableHeader={TableHeader}
          caption="Tutores"
          renderRow={renderStudentRow}
        />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Tutores;
