"use client";
import React, { useEffect, useState } from "react";
import GenericTable from "../../common/components/generic-table";

import { IconButton, Td, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import { Student, UpdateStudentDto, UserService } from "../../services/admin-service";
import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import EditModal from "../../common/components/modals/edit-modal";
import DeleteModal from "../../common/components/modals/detele-modal";

const Estudiantes: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const toast = useToast();
  const [loading, setLoading] = useState(true);

  const {
    isOpen: isEditModalOpen,
    onOpen: openEditModal,
    onClose: closeEditModal,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure();
  const [formData, setFormData] = useState({
    name: " ",
  });

  const TableHeader = [
    "Nombre",
    "Apellido",
    "Num. Celular",
    "Correo",
    "Carrera/s",
  ];

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const fetchedStudents = await UserService.fetchAllStudents();
        setStudents(fetchedStudents);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError("No se pudieron cargar los estudiantes.");
      } finally {
        setLoading(false);
      }
    };
  
    loadStudents();
  }, []);
  


  const handleDeleteClick = (student : Student) => {
    setSelectedStudent(student)

    openDeleteModal();
  }

  const handleEditClick = (student: Student ) => {
    setSelectedStudent(student);
    setFormData({
      name: student.user.name,

    });
    openEditModal();
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditConfirm = async () => {
    if (selectedStudent) {
      try {
        await UserService.updateStudent(selectedStudent.id, formData);

        const updateStudent = await UserService.fetchAllStudents();
        setStudents(updateStudent);

        toast({
          title: "Tutor actualizado.",
          description: "El tutor ha sido actualizado con éxito.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        closeEditModal();

      } catch (error) {
        console.error("Error al editar estudiante:", error);
        toast({
          title: "Error",
          description: "No se pudo editar el estudiante. Intenta de nuevo.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };
  

  const handleDeleteConfirm = async () => {
    if (selectedStudent) {
      try {
        await UserService.deleteStudent(selectedStudent.id);
        setStudents(
          students?.filter((student) => student.user.id !== selectedStudent.user.id) || []
        );
        toast({
          title: "Estudiante eliminado.",
          description: "El tutor ha sido eliminado correctamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        closeDeleteModal();
      } catch (err) {
        console.error("Error al eliminar:", err);
        toast({
          title: "Error al eliminar tutor.",
          description: "Hubo un error al intentar eliminar al tutor.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };
  
  

  const renderStudentRow = (student: Student) => (
    <Tr key={student.user.id}>
      <Td>{student.user.name}</Td>
      <Td>{student.user.lastName}</Td>
      <Td>{student.telephone}</Td>
      <Td>{student.user.email}</Td>
      {/* <Td>{student.}</Td> */}
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
          onClick={() => handleEditClick(student)}
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
          onClick={() => handleDeleteClick(student)}
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
          caption="Alumnos"
          renderRow={renderStudentRow}
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
      title="Editar Alumno"
      entityName="Alumno"
      />

      <DeleteModal
      isOpen={isDeleteModalOpen}
      onClose={closeDeleteModal}
      onDelete={handleDeleteConfirm}
      entityName="alumnos"
      entityDetails={`${selectedStudent?.user.name} ${selectedStudent?.user.lastName}`}
      />
    </>
  );
};

export default Estudiantes;
