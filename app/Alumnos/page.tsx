"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import GenericTable from "../../common/components/generic-table";
import { IconButton, Select, Td, Tr, useDisclosure, useToast } from "@chakra-ui/react";
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
import { StudentCareer } from "../interfaces/studentCareer.interface";
import { Career } from "../interfaces/career.interface";
import { SubjectCareerWithState } from "../interfaces/subject-career-student.interface";
import SubjectModal from "../../common/components/modals/subject-student-modal";
import { SubjectState } from '../enums/subject-state.enum'
import CareerModal from "../../common/components/modals/create-career-student-modal";
import { CreateCareer } from "../interfaces/create-career.interface";
import { ResponseCreateCareer } from "../interfaces/response-create-career.interface";

const Estudiantes: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [subjects, setSubjects] = useState<SubjectCareerWithState[]>([]);
  const [editedSubjects, setEditedSubjects] = useState<{ [subjectId: number]: string }>({});
  const [editSubjectId, setEditSubjectId] = useState<number | null>(null);
  const [openSubjectState, setOpenSubjectState] = useState(false);

  const toast = useToast();
  const [loading, setLoading] = useState(true);

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
    isOpen: isCreateModalOpen,
    onOpen: openCreateModal,
    onClose: closeCreateModal,
  } = useDisclosure()
  const {
    isOpen: isViewModalOpen,
    onOpen: openViewModal,
    onClose: closeViewModal,
  } = useDisclosure();

  const {
    isOpen: isSubjectModalOpen,
    onOpen: openSujectModal,
    onClose: closeSubjectModal
  } = useDisclosure()

  const {
    isOpen: isCreateCareerModalOpen,
    onOpen: openCreateCareerModal,
    onClose: closeCreateCareerModal
  } = useDisclosure()


  const [formData, setFormData] = useState<UpdateStudentDto>({
    name: " ",
    lastName: " ",
    dni: " ",
    telephone: "",
    birthdate: new Date(),
    address: "",
    year: new Date(),
    observations: '',
    countryId: 1,
    email: '',
    careers: []
  });


  const [careerData, setCareerData] = useState<CreateCareer>({
    name: '',
    yearOfAdmission: 0,
    studentId: 0
  })

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

  const handleDeleteClick = (student: Student) => {
    setSelectedStudent(student)

    openDeleteModal();
  }

  const handleEditClick = async (student: Student) => {
    try {
      const studentSelected = await UserService.fetchStudent(student.id)
      setSelectedStudent(studentSelected)
      setFormData({
        name: studentSelected.user.name || '',
        lastName: studentSelected.user.lastName || '',
        dni: studentSelected.dni || '',
        telephone: studentSelected.telephone || '',
        birthdate: studentSelected.birthdate || new Date(),
        address: studentSelected.address || '',
        year: studentSelected.yearEntry || new Date(),
        observations: studentSelected.observations || "",
        countryId: studentSelected.countryId,
        email: studentSelected.user.email || '',
        careers: studentSelected.careers
      })
      openEditModal();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo obtener los datos del estudiante',
        status: 'error'
      })
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "birthdate" || name === "yearEntry"
          ? new Date(value).toISOString().split('T')[0]  // yyyy-MM-dd
          : name === "careerId" || name === "countryId"
            ? parseInt(value)
            : value,
    }));
  };

  const handleChangeCreateCareer = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setCareerData(prev => ({
      ...prev,
      [name]: name === "yearOfAdmission" ? parseInt(e.target.value) : value
    }))
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

  const handleCreateCareerClick = () => {
    if (selectedStudent?.id) {
      setCareerData({
        name: '',
        yearOfAdmission: new Date().getFullYear(),
        studentId: selectedStudent.id
      });
      openCreateCareerModal();
    }
  };

  const handleViewClick = (student: Student) => {
    setSelectedStudent(student);
    openViewModal();
  };

  const handleStudentUpdate = async () => {
    if (selectedStudent) {
      try {
        const newObservationStudent = await UserService.updateStudentModal(selectedStudent.id, formData.lastName, formData.name, formData.email, formData.telephone, formData.observations);
        setFormData(newObservationStudent)

        setStudents(prevStudents =>
          prevStudents.map(student =>
            student.id === selectedStudent.id
              ? {
                ...student,
                user: {
                  ...student.user,
                  name: formData.name,
                  lastName: formData.lastName,
                  email: formData.email
                },
                telephone: formData.telephone,
                observations: formData.observations
              }
              : student
          )
        );

        toast({
          title: "Alumno actualizado.",
          description: "El alumno ha sido actualizado.",
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

  const handleAllSubject = async (career: StudentCareer) => {
    if (!selectedStudent?.id || !career?.careerId) {
      toast({
        title: 'Error',
        description: 'Faltan datos del estudiante o de la carrera',
        status: 'error'
      });
      return;
    }

    try {
      const careerSelected = await UserService.fetchCareers(career.careerId)
      setSelectedCareer(careerSelected)

      const allSubjects = await UserService.fetchStudentSubject(selectedStudent?.id, careerSelected.id)
      setSubjects(allSubjects)

      openSujectModal();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo obtener las materias de la carrera',
        status: 'error'
      })
    }
  };

  const handleEditSubject = async () => {
    setOpenSubjectState(false)
    setEditSubjectId(null)

    if (selectedStudent) {
      try {
        const updates = Object.entries(editedSubjects)
        if (updates.length > 0) {
          await Promise.all(
            updates.map(([subjectIdStr, newState]) =>
              UserService.updateStateSubject(
                selectedStudent.id,
                parseInt(subjectIdStr),
                newState
              ))
          );
        }

        setSubjects(prevSubject =>
          prevSubject.map(subject => {
            const newState = editedSubjects[subject.subjectId];
            if (newState) {
              return {
                ...subject,
                subjectState: newState,
                updateAt: new Date()
              };
            }
            return subject;
          })
        )
 
        setEditedSubjects({})

        toast({
          title: "Los estados de las materias del alumno, han sido actualizadas.",
          description: "Las materias ya tienen el nuevo estado.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error al editar el estado de la materia:", error);
        toast({
          title: "Error",
          description: "No se pudo editar el estado de la materia. Intenta de nuevo.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  }


  const handleEditSubjectClick = async (subjectId: number) => {
    if (editSubjectId !== null && editSubjectId !== subjectId) {
      const previousSubjectId = editSubjectId
      const newState = editedSubjects[previousSubjectId]

      if (newState) {
        setSubjects(prevSubject => prevSubject.map(subject => {
          if (subject.subjectId === previousSubjectId) {
            return {
              ...subject,
              subjectState: newState
            }
          }
          return subject;
        }))
      }
    }
    setEditSubjectId(subjectId);
    setOpenSubjectState(true);
  }

  const handleCreateCareer = async () => {
    if (selectedStudent?.id) {
      try {
        const newCareer = await UserService.createCareer(careerData)
        setCareerData({
          name: newCareer.name,
          yearOfAdmission: newCareer.yearOfThenPlan,
          studentId: selectedStudent?.id
        })

        setFormData(prevFormData => ({
          ...prevFormData,
          careers: [...prevFormData.careers, {
            name: careerData.name,
            year: careerData.yearOfAdmission,
            active: true,
            careerId: newCareer.id
          }]
        }));
        toast({
          title: 'Carrera creada',
          description: 'La carrera fue creada con exito',
          status: 'success',
          duration: 5000,
          isClosable: true
        });

        closeCreateCareerModal();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Error en la creacion de la carrera',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    }
  }

  const handleCloseModalSubject = () => {
    setEditedSubjects({})
    closeSubjectModal();
  }


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

  const renderCareerRow = (career: StudentCareer) => (
    <Tr key={career.careerId}>
      <Td>{career.name}</Td>
      <Td>{career.active ? 'Activa' : 'Inactiva'}</Td>
      <Td>{career.year}</Td>
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
        // onClick={() => handleViewClick(student)}
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
          onClick={() => handleAllSubject(career)}
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
        // onClick={() => handleDeleteClick(student)}
        />
      </Td>
    </Tr>
  )

  const renderSubjectRow = (subject: SubjectCareerWithState) => (
    <Tr key={subject.subjectId}>
      <Td>{subject.subjectName}</Td>
      <Td>{subject.year}</Td>
      <Td>
        {editedSubjects[subject.subjectId] !== undefined ? (
          <Select value={editedSubjects[subject.subjectId] ?? subject.subjectState} onChange={e => setEditedSubjects(prev => ({ ...prev, [subject.subjectId]: e.target.value }))}>
            <option value="APPROVED">{SubjectState.APPROVED}</option>
            <option value="REGULARIZED">{SubjectState.REGULARIZED}</option>
            <option value="FREE">{SubjectState.FREE}</option>
            <option value="INPROGRESS">{SubjectState.INPROGRESS}</option>
            <option value="NOTATTENDED">{SubjectState.NOTATTENDED}</option>
            {/* <option value="RETAKING">{SubjectState.RETAKING}</option> */}
          </Select>
        ) : (
          editedSubjects[subject.subjectId] || subject.subjectState
        )}

      </Td>
      <Td>
        {subject.updateAt ? new Date(subject.updateAt).toLocaleDateString() : '-'}
      </Td>
      <Td>
        <IconButton
          icon={<EditIcon boxSize={5} />}
          aria-label="Edit"
          mr={5}
          backgroundColor={editSubjectId === subject.subjectId ? "#318AE4" : "white"}
          _hover={{
            borderRadius: 15,
            backgroundColor: "#318AE4",
            color: "White",
          }}
          onClick={() => {
            setEditSubjectId(subject.subjectId)
            setEditedSubjects(prev => ({
              ...prev,
              [subject.subjectId]: subject.subjectState
            }))
            handleEditSubjectClick(subject.subjectId)
          }
          }
        />
      </Td>
    </Tr>
  )

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
        onConfirm={handleStudentUpdate}
        formData={formData}
        onInputChange={handleChange}
        title="Editar Alumno"
        entityName="Alumno"
        renderCareerNow={renderCareerRow}
        createOpen={handleCreateCareerClick}
        fieldLabels={{
          lastName: "Apellido/s",
          name: "Nombre",
          mail: "Correo",
          telephone: "Nro. De telefono",
          observations: "Observaciones",
          careersId: "Carrera/s"
        }}
      />

      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={handleCloseModalSubject}
        onConfirm={handleEditSubject}
        subjects={subjects}
        renderSubjectNow={renderSubjectRow}
        titleCareer={selectedCareer?.name}
        entityName="Materias"
      />

      <CareerModal
        isOpen={isCreateCareerModalOpen}
        onClose={closeCreateCareerModal}
        onConfirm={handleCreateCareer}
        careerData={careerData}
        handleChange={handleChangeCreateCareer}
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