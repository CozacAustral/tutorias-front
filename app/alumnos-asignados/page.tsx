'use client'
import React, { useEffect, useState } from "react";
import GenericTable from "../../common/components/generic-table";
import { IconButton, Td, Tr } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";


export interface Student {
  id: number;
  name: string;
  lastName: string;
  email: string;
  tutorName: string | null; 
}


export const StudentService = {
  fetchAllStudentsAndTutors: async (): Promise<Student[]> => {
    return new Promise<Student[]>((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: "Juan",
            lastName: "Pérez",
            email: "juan.perez@example.com",
            tutorName: "Profesor García",
          },
          {
            id: 2,
            name: "Ana",
            lastName: "González",
            email: "ana.gonzalez@example.com",
            tutorName: "Profesora Martínez",
          },
          {
            id: 3,
            name: "Luis",
            lastName: "Ramírez",
            email: "luis.ramirez@example.com",
            tutorName: null, 
          },
        ]);
      }, 1000); 
    });
  },
};


const alumnos_asignados : React.FC = () => {
  const [students, setStudents] = useState<Student[] | null>(null);
  const [error, setError] = useState<string | null>(null);


  const TableHeader = ["Nombre del Alumno",  "Tutor Asignado"];


  useEffect(() => {
    async function fetchStudents() {
      try {
        const data: Student[] = await StudentService.fetchAllStudentsAndTutors(); 
        setStudents(data);
      } catch (err) {
        setError("Failed to load students");
        console.error(err);
      }
    }
    fetchStudents();
  }, []);

  const renderStudnetandTutorsRow = (student: Student) => (
    <Tr key={student.id}>
      <Td>{student.name}</Td>
      <Td>{student.tutorName || "Sin tutor asignado"}</Td> 
      <Td>
        <>
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
        </>
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
          renderRow={renderStudnetandTutorsRow}
          caption="Alumnos Asignados"
        />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default alumnos_asignados