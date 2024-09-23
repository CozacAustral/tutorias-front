"use client";

import React, { useEffect, useState } from "react";
import { IconButton, Td, Tr } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { Student, StudentService } from "./action.tsx/action";
import GenericTable from "../../common/components/GenericTable";

const Alumnos: React.FC = () => {
  // const { data, isError } = useQueries(["users"], async () =>
  //   UserService.fetchAllUsers()
  // );
  const [students, setStudents] = useState<Student[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const TableHeader = [
    "Apellido/s",
    "Nombre",
    "Num. Celular",
    "Correo",
    "Carrera",
  ];

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await StudentService.fetchAllStudents();
        setStudents(data);
        console.log(data);
      } catch (err) {
        setError("Failed to load users");
        console.error(err);
      }
    }
    fetchUsers();
  }, []);
  const renderStudentRow = (students: Student) => (
    <Tr key={students.id}>
      <Td>{students.user.lastName}</Td>
      <Td>{students.user.name}</Td>
      <Td>{students.telephone}</Td>
      <Td>{students.user.email}</Td>
      <Td>{students.career.name}</Td>

      <Td>
        <IconButton
          icon={<EditIcon boxSize={5} />}
          aria-label="Edit"
          mr={10}
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
          renderRow={renderStudentRow}
          caption="Alumnos"
        />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Alumnos;
