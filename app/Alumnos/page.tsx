"use client";
import React, { useEffect, useState } from "react";
import GenericTable from "../../common/components/generic-table";
import { IconButton, Td, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import { UserService } from "../../services/admin-service";
import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import EditModal from "../../common/components/modals/edit-modal";
import DeleteModal from "../../common/components/modals/detele-modal";
import ImportModal from "../../common/components/modals/import-modal";
import CreateStudentModal from "../../common/components/modals/create-student-modal";
import { useRouter } from "next/navigation";
import ViewStudentModal from "../../common/components/modals/view-student-modal";
import { Student } from "../interfaces/student.interface";
import { UpdateStudentDto } from "../interfaces/update-student";


const Estudiantes: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const {
    isOpen: isEditModalOpen,
    onOpen: openEditModal,
    onClose: closeEditModal,
  } = useDisclosure();
  const {
    isOpen: isImportModalOpen,
    onOpen: openImportModal,
    onClose: closeImportModal,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure();
  const {
    isOpen:isCreateModalOpen,
    onOpen: openCreateModal,
    onClose: closeCreateModal,
  } = useDisclosure()
  const {
    isOpen: isViewModalOpen,
    onOpen: openViewModal,
    onClose: closeViewModal,
  } = useDisclosure();
  


  const [formData, setFormData] = useState<UpdateStudentDto>({
    name: " ",
    lastName: " ", 
    dni: " ",
    telephone: "",
    birthdate: new Date,
    address: "",
    yearEntry: new Date(),
    observations: "",
    countryId: 0,
    careersId: [],
    
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
        console.log(fetchedStudents)
      } catch (error) {
        console.error('Error fetching students:', error);
        setError("No se pudieron cargar los estudiantes.");
      } finally {
        setLoading(false);
      }
    };
  
    loadStudents();
  }, []);
  




  const handleDeleteClick = (student : Student ) => {
    setSelectedStudent(student)

    openDeleteModal();
  }

  const handleEditClick = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
    name: student.user.name,
    lastName: student.user.lastName,
    dni: student.dni,
    telephone: student.telephone,
    birthdate: student.birthdate, 
    address: student.address,
    yearEntry: student.yearEntry, 
    observations: student.observations || "",
    countryId: student.countryId,
    careersId: Array.isArray(student.careersId) ? student.careersId : [student.careersId],
    });
    openEditModal();
  };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name ==="countryId" ? parseInt(value) : value,
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

  const handleAddStudent = async () => {
      const fetchedStudents = await UserService.fetchAllStudents();
      setStudents(fetchedStudents); 
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

  const handleImport = (data: any) => {
    console.log("imported data", data)
  }
  
  const handleCreateClick = () => {
    openCreateModal();
  };

  const handleViewClick = (student: Student) => {
    setSelectedStudent(student);
    openViewModal();
  };
  
  
  const renderStudentRow = (student: Student) => (
    <Tr key={student.user.id}>
      <Td>{student.user.name}</Td>
      <Td>{student.user.lastName}</Td>
      <Td>{student.telephone}</Td>
      <Td>{student.user.email}</Td>
      <Td>{student.careers && student.careers.length > 0 ? student.careers[0]?.name : 'No name available'}</Td>
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
          onClick={() => handleViewClick(student)}
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
          showAddMenu={true}
          onImportOpen={openImportModal}
          onCreateOpen={handleCreateClick}
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
      fieldLabels={{
        name: "Nombre",
        lastName: "Apellido",
        dni: "DNI",
        telephone:"Telefono",
        birthdate: "Fecha de Nacimiento",
        address: "Direccion",
        yearEntry: "Año ingreso",
        observations: "Observaciones",
        countryId: "Pais",
        careersId: "Carrera/s"
      }}
      />

      <ImportModal
      isOpen={isImportModalOpen}
      onClose={closeImportModal}
      onImport={handleImport}
      />
      <ViewStudentModal
      isOpen={isViewModalOpen}
      onClose={closeViewModal}
      student={selectedStudent}
      />

      <CreateStudentModal
      isOpen={isCreateModalOpen}
      onClose={closeCreateModal}
      onAddStudent={handleAddStudent}
      />

      <DeleteModal
      isOpen={isDeleteModalOpen}
      onClose={closeDeleteModal}
      onDelete={handleDeleteConfirm}
      entityName="alumno"
      entityDetails={`${selectedStudent?.user.name} ${selectedStudent?.user.lastName}`}
      />
    </>
  );
};

export default Estudiantes;