"use client";
import React, { useEffect, useState } from "react";
import GenericTable from "../../common/components/generic-table";

import { IconButton, Td, Tr } from "@chakra-ui/react";
import { User, UserService } from "../../services/admin-service";
import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";

const Estudiantes: React.FC = () => {
  const [students, setStudents] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const TableHeader = [
    "Nombre",
    "Apellido",
    "Num. Celular",
    "Correo",
    "Carrera/s",
  ];

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

  const renderStudentRow = (student: User) => (
    <Tr key={student.id}>
      <Td>{student.name}</Td>
      <Td>{student.lastName}</Td>
      <Td>{student.role}</Td>
      <Td>{student.email}</Td>
      <Td>{student.role}</Td>
      <Td>
        <IconButton
          icon={<ViewIcon boxSize={5} />}
          aria-label="View"
          backgroundColor="white"
          mr={5}
          _hover={{
            borderRadius: 15,
            backgroundColor: "#318AE4",
            color: "White",
          }}
        />
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
          caption="Estudiantes"
          renderRow={renderStudentRow}
        />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Estudiantes;
