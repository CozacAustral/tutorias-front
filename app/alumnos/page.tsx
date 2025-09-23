"use client";
import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Select,
  Td,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import DeleteModal from "../../common/components/modals/detele-modal";
import EditModal from "../../common/components/modals/edit-modal";
import ImportModal from "../../common/components/modals/import-modal";
import { UserService } from "../../services/admin-service";
import { SubjectState } from "../enums/subject-state.enum";
import { Career } from "../interfaces/career.interface";
import { Country } from "../interfaces/country.interface";
import { AssignedCareer } from "../interfaces/create-career.interface";
import { CreateStudent } from "../interfaces/CreateStudent";
import { Student } from "../interfaces/student.interface";
import { StudentCareer } from "../interfaces/studentCareer.interface";
import { SubjectCareerWithState } from "../interfaces/subject-career-student.interface";
import { UpdateStudentDto } from "../interfaces/update-student";
import CareerModal from "./modals/create-career-student-modal";
import CreateStudentModal from "./modals/create-student-modal";
import PaginateStudent from "./modals/paginate-student";
import SubjectModal from "./modals/subject-student-modal";
import ViewStudentModal from "./modals/view-student-modal";

const Estudiantes: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [selectedCareerState, setSelectedCareerState] = useState<
    boolean | null
  >(null);
  const [subjects, setSubjects] = useState<SubjectCareerWithState[]>([]);
  const [editedSubjects, setEditedSubjects] = useState<{
    [subjectId: number]: string;
  }>({});
  const [editSubjectId, setEditSubjectId] = useState<number | null>(null);
  const [openSubjectState, setOpenSubjectState] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalStudents, setTotalStudents] = useState(0);
  const [orderBy, setOrderBy] = useState<[string, "ASC" | "DESC"] | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(0);

  const toast = useToast();

  const jwt = require("jsonwebtoken");

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
  } = useDisclosure();
  const {
    isOpen: isViewModalOpen,
    onOpen: openViewModal,
    onClose: closeViewModal,
  } = useDisclosure();

  const {
    isOpen: isSubjectModalOpen,
    onOpen: openSujectModal,
    onClose: closeSubjectModal,
  } = useDisclosure();

  const {
    isOpen: isCreateCareerModalOpen,
    onOpen: openCreateCareerModal,
    onClose: closeCreateCareerModal,
  } = useDisclosure();

  const [formData, setFormData] = useState<UpdateStudentDto>({
    name: " ",
    lastName: " ",
    dni: " ",
    telephone: "",
    birthdate: new Date(),
    address: "",
    year: new Date(),
    observations: "",
    countryId: 1,
    email: "",
    careers: [
      {
        careerId: 0,
        name: "",
        active: false,
        yearEntry: 0,
        yearOfThePlan: 0,
      },
    ],
  });

  const [studentData, setStudentData] = useState<CreateStudent>({
    name: "",
    lastName: "",
    dni: "",
    email: "",
    telephone: "",
    birthdate: new Date().toISOString(),
    address: "",
    yearEntry: new Date().toISOString(),
    observations: "",
    countryId: 1,
    careerId: 1,
  });

  const [careerData, setCareerData] = useState<AssignedCareer>({
    careerId: 0,
    studentId: 0,
    yearOfAdmission: 0,
  });

  const TableHeader = [
    "Nombre",
    "Apellido",
    "Num. Celular",
    "Correo",
    "Carrera/s",
  ];

  const TableHeaderTutor = [
    "Apellido/s",
    "Nombre",
    "Correo",
    "Nro de telefono",
    "Carrera/s",
  ];

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const { students, totalCount } = await UserService.fetchAllStudents({
          search: searchTerm,
          currentPage,
          resultsPerPage: 10,
          orderBy: orderBy,
        });
        setStudents(students);
        setTotalStudents(totalCount);
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("No se pudieron cargar los estudiantes.");
      } finally {
        setLoading(false);
      }
    };

    const token = Cookies.get("authTokens");
    if (!token) {
      console.log("No token found");
      return;
    }

    try {
      const decodedToken = jwt.decode(token);
      console.log("Decode TOKEN: ", decodedToken);
      setRole(decodedToken?.role);
    } catch (error) {
      console.error("Error decoding token: ", error);
    }

    loadStudents();
  }, [currentPage, searchTerm, orderBy]);

  useEffect(() => {
    const loadCareers = async () => {
      try {
        const fetchedCareers = await UserService.fetchAllCareers();
        setCareers(fetchedCareers);
      } catch (error) {
        console.error("Error fetching careers: ", error);
        setError("No se puedieron cargar las carreras.");
      } finally {
        setLoading(false);
      }
    };

    loadCareers();
  }, []);

  useEffect(() => {
    if (role === 2) {
      setLoading(false);
      setError(null);
      return;
    }

    const loadCountries = async () => {
      try {
        const fetchedCountries = await UserService.fetchAllCountries();
        setCountries(fetchedCountries);
      } catch (error) {
        console.error("Error fetching countries: ", error);
        setError("No se pudieron cargar los países.");
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, [role]);

  const handleDeleteClick = (student: Student) => {
    setSelectedStudent(student);

    openDeleteModal();
  };

  const handleOrderChange = (field: string, direction: "ASC" | "DESC") => {
    setOrderBy([field, direction]);
    setCurrentPage(1);
  };

  const handleEditClick = async (student: Student) => {
    console.log("CUANDO SE PRESIONA EDIT DESDE ADMIN: ", student);
    try {
      const studentSelected = await UserService.fetchStudent(student.id);
      setSelectedStudent(studentSelected);
      setFormData({
        name: studentSelected.user.name || "",
        lastName: studentSelected.user.lastName || "",
        dni: studentSelected.dni || "",
        telephone: studentSelected.telephone || "",
        birthdate: studentSelected.birthdate || new Date(),
        address: studentSelected.address || "",
        year: studentSelected.yearEntry || new Date(),
        observations: studentSelected.observations || "",
        countryId: studentSelected.countryId,
        email: studentSelected.user.email || "",
        careers: studentSelected.careers,
      });
      openEditModal();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo obtener los datos del estudiante",
        status: "error",
      });
    }
    console.log(
      "Datos CARRER CUANDO SE PRESIONA EDIT DESDE ADMIN: ",
      formData.careers
    );
  };

  const handleChangeCreateStudent = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setStudentData((prevData) => ({
      ...prevData,
      [name]:
        name === "birthdate" || name === "yearEntry"
          ? value
          : name === "careerId" || name === "countryId"
            ? parseInt(value)
            : value,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "birthdate" || name === "yearEntry"
          ? new Date(value).toISOString().split("T")[0] // yyyy-MM-dd
          : name === "careerId" || name === "countryId"
            ? parseInt(value)
            : value,
    }));
  };

  const handleAddStudent = async () => {
    const fetchedStudents = await UserService.fetchAllStudents();
    setStudents(fetchedStudents.students);
  };

  const handleDeleteConfirm = async () => {
    if (selectedStudent) {
      try {
        await UserService.deleteStudent(selectedStudent.id);
        setStudents(
          students?.filter(
            (student) => student.user.id !== selectedStudent.user.id
          ) || []
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
    console.log("imported data", data);
  };

  const handleCreateClick = () => {
    openCreateModal();
  };

  const handleCreateCareerClick = () => {
    if (selectedStudent?.id) {
      setCareerData({
        careerId: 0,
        studentId: selectedStudent.id,
        yearOfAdmission: new Date().getFullYear(),
      });
      openCreateCareerModal();
    }
  };

  const handleViewClick = (student: Student) => {
    console.log("Student cuando se presiona el view", student);

    if (student && student.user) {
      const formattedStudent: UpdateStudentDto = {
        name: student.user.name || "",
        lastName: student.user.lastName || "",
        email: student.user.email || "",
        telephone: student.telephone || "",
        observations: student.observations || "",
        careers: student.careers || [],
        dni: student.dni || "",
        birthdate: student.birthdate || "",
        address: student.address || "",
        year: student.yearEntry || "",
        countryId: student.countryId || 1,
      };

      setSelectedStudent(student);
      setFormData(formattedStudent);
      openViewModal();
    } else {
      console.error("Student data is incomplete:", student);
    }

    console.log("CARRERAS DEL ESTUDIANTE: ", formData.careers);
  };

  const handleStudentUpdate = async () => {
    if (selectedStudent) {
      try {
        const newObservationStudent = await UserService.updateStudentModal(
          selectedStudent.id,
          formData.lastName,
          formData.name,
          formData.email,
          formData.telephone,
          formData.observations
        );
        setFormData(newObservationStudent);

        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.id === selectedStudent.id
              ? {
                  ...student,
                  user: {
                    ...student.user,
                    name: formData.name,
                    lastName: formData.lastName,
                    email: formData.email,
                  },
                  telephone: formData.telephone,
                  observations: formData.observations,
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
    setSelectedCareerState(career.active);

    if (!selectedStudent?.id || !career?.careerId) {
      toast({
        title: "Error",
        description: "Faltan datos del estudiante o de la carrera",
        status: "error",
      });
      return;
    }

    try {
      const careerSelected = await UserService.fetchCareers(career.careerId);
      setSelectedCareer(careerSelected);

      const allSubjects = await UserService.fetchStudentSubject(
        selectedStudent?.id,
        careerSelected.id
      );
      setSubjects(allSubjects);

      openSujectModal();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo obtener las materias de la carrera",
        status: "error",
      });
    }
  };

  const handleEditSubject = async () => {
    setOpenSubjectState(false);
    setEditSubjectId(null);

    if (selectedStudent) {
      try {
        const updates = Object.entries(editedSubjects);
        if (updates.length > 0) {
          await Promise.all(
            updates.map(([subjectIdStr, newState]) =>
              UserService.updateStateSubject(
                selectedStudent.id,
                parseInt(subjectIdStr),
                newState
              )
            )
          );
        }

        setSubjects((prevSubject) =>
          prevSubject.map((subject) => {
            const newState = editedSubjects[subject.subjectId];
            if (newState) {
              return {
                ...subject,
                subjectState: newState,
                updateAt: new Date(),
              };
            }
            return subject;
          })
        );

        setEditedSubjects({});

        toast({
          title:
            "Los estados de las materias del alumno, han sido actualizadas.",
          description: "Las materias ya tienen el nuevo estado.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error al editar el estado de la materia:", error);
        toast({
          title: "Error",
          description:
            "No se pudo editar el estado de la materia. Intenta de nuevo.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleEditSubjectClick = async (subjectId: number) => {
    if (editSubjectId !== null && editSubjectId !== subjectId) {
      const previousSubjectId = editSubjectId;
      const newState = editedSubjects[previousSubjectId];

      if (newState) {
        setSubjects((prevSubject) =>
          prevSubject.map((subject) => {
            if (subject.subjectId === previousSubjectId) {
              return {
                ...subject,
                subjectState: newState,
              };
            }
            return subject;
          })
        );
      }
    }
    setEditSubjectId(subjectId);
    setOpenSubjectState(true);
  };

  const handleChangeCreateCareer = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "careerId") {
      const career = careers.find((c) => c.id === parseInt(value));
      setSelectedCareer(career || null);
    }

    setCareerData((prev) => ({
      ...prev,
      [name]:
        name === "yearOfAdmission"
          ? parseInt(e.target.value)
          : name === "careerId"
            ? parseInt(value)
            : value,
    }));
  };

  const handleCreateCareer = async () => {
    if (selectedStudent?.id && selectedCareer?.id) {
      try {
        await UserService.createCareer(careerData);

        const updatedStudent = await UserService.fetchStudent(
          selectedStudent.id
        );

        setFormData((prevFormData) => ({
          ...prevFormData,
          careers: updatedStudent.careers,
        }));

        toast({
          title: "Carrera creada",
          description: "La carrera fue creada con exito",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        closeCreateCareerModal();
      } catch (error) {
        toast({
          title: "Error",
          description: "Error en la creacion de la carrera",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleCloseModalSubject = () => {
    setEditedSubjects({});
    closeSubjectModal();
  };

  const renderStudentRow = (student: Student) => (
    <Tr key={student.id}>
      <Td>{student.user?.name}</Td>
      <Td>{student.user?.lastName}</Td>
      <Td>{student.telephone}</Td>
      <Td>{student.user?.email}</Td>
      <Td>
        {student.careers && student.careers.length > 0
          ? student.careers[0]?.name
          : "No name available"}
      </Td>
      {role !== 2 ? (
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
      ) : (
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
            aria-label="Seleccionar fecha"
            icon={<FaRegCalendarAlt />}
            variant="ghost"
          />
        </Td>
      )}
    </Tr>
  );

  const renderCareerRow = (career: StudentCareer) => (
    <Tr key={career.careerId}>
      <Td>{career.name}</Td>
      <Td>{career.active ? "Activa" : "Inactiva"}</Td>
      <Td>{career.yearEntry}</Td>
      <Td>
        {role === 2 ? (
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
            onClick={() => handleAllSubject(career)}
          />
        ) : (
          <>
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
          </>
        )}
      </Td>
    </Tr>
  );

  const renderSubjectRow = (subject: SubjectCareerWithState) => (
    <Tr key={subject.subjectId}>
      <Td>{subject.subjectName}</Td>
      <Td>{subject.year}</Td>
      <Td>
        {editedSubjects[subject.subjectId] !== undefined ? (
          <Select
            value={editedSubjects[subject.subjectId] ?? subject.subjectState}
            onChange={(e) =>
              setEditedSubjects((prev) => ({
                ...prev,
                [subject.subjectId]: e.target.value,
              }))
            }
          >
            {Object.entries(SubjectState).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </Select>
        ) : (
          SubjectState[
            (editedSubjects[subject.subjectId] ||
              subject.subjectState) as keyof typeof SubjectState
          ]
        )}
      </Td>
      <Td>
        {subject.updateAt
          ? new Date(subject.updateAt).toLocaleDateString()
          : "-"}
      </Td>
      <Td>
        {role === 2 ? null : (
          <IconButton
            icon={<EditIcon boxSize={5} />}
            aria-label="Edit"
            mr={5}
            backgroundColor={
              editedSubjects[subject.subjectId] ? "#318AE4" : "white"
            }
            _hover={{
              borderRadius: 15,
              backgroundColor: "#318AE4",
              color: "White",
            }}
            onClick={() => {
              setEditSubjectId(subject.subjectId);
              setEditedSubjects((prev) => ({
                ...prev,
                [subject.subjectId]: subject.subjectState,
              }));
              handleEditSubjectClick(subject.subjectId);
            }}
          />
        )}
      </Td>
    </Tr>
  );

  return (
    <>
      <PaginateStudent
        data={students}
        TableHeader={role === 2 ? TableHeaderTutor : TableHeader}
        caption={role === 2 ? "Mis Alumnos" : "Alumnos"}
        renderRow={renderStudentRow}
        showAddMenu={role === 2 ? false : true}
        onImportOpen={role !== 2 ? openImportModal : undefined}
        onCreateOpen={role !== 2 ? handleCreateClick : undefined}
        currentPage={currentPage}
        totalItems={totalStudents}
        onPageChange={(page) => setCurrentPage(page)}
        searchTerm={searchTerm}
        onSearch={(term) => {
          setSearchTerm(term);
          setCurrentPage(1);
        }}
        orderBy={orderBy}
        onOrderChange={handleOrderChange}
      />

      {error && role !== 2 && <p>{error}</p>}

      <EditModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onConfirm={handleStudentUpdate}
        formData={formData}
        onInputChange={handleChange}
        title="Ver Alumno"
        entityName="Alumno"
        renderCareerNow={renderCareerRow}
        createOpen={handleCreateCareerClick}
        showButtonCancelSave={true}
        fieldLabels={{
          lastName: "Apellido/s",
          name: "Nombre",
          mail: "Correo",
          telephone: "Nro. De telefono",
          observations: "Observaciones",
          careersId: "Carrera/s",
        }}
        role={role}
      />

      {role === 2 ? (
        <SubjectModal
          isOpen={isSubjectModalOpen}
          onClose={handleCloseModalSubject}
          onConfirm={handleEditSubject}
          subjects={subjects}
          renderSubjectNow={renderSubjectRow}
          titleCareer={selectedCareer?.name}
          entityName="Materias"
          state={selectedCareerState}
          role={role}
          showButtonCancelSave={false}
        />
      ) : (
        <SubjectModal
          isOpen={isSubjectModalOpen}
          onClose={handleCloseModalSubject}
          onConfirm={handleEditSubject}
          subjects={subjects}
          renderSubjectNow={renderSubjectRow}
          titleCareer={selectedCareer?.name}
          entityName="Materias"
          state={selectedCareerState}
          role={role}
          showButtonCancelSave={true}
        />
      )}

      <CareerModal
        isOpen={isCreateCareerModalOpen}
        onClose={closeCreateCareerModal}
        onConfirm={handleCreateCareer}
        careerData={careerData}
        handleChange={handleChangeCreateCareer}
        careers={careers}
      />

      {role !== 2 && (
        <ImportModal
          isOpen={isImportModalOpen}
          onClose={closeImportModal}
          onImport={handleImport}
        />
      )}

      {role === 2 ? (
        <EditModal
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
          onConfirm={handleStudentUpdate}
          formData={formData}
          onInputChange={handleChange}
          caption="Ver Alumno"
          renderCareerNow={renderCareerRow}
          createOpen={handleCreateCareerClick}
          forTutor={true}
          isViewModal={true}
          fieldLabels={{
            lastName: "Apellido/s",
            name: "Nombre",
            mail: "Correo",
            telephone: "Nro. De telefono",
            observations: "Observaciones",
          }}
          showButtonCancelSave={false}
        />
      ) : (
        <ViewStudentModal
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
          student={selectedStudent}
        />
      )}

      {role !== 2 && (
        <CreateStudentModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onAddStudent={handleAddStudent}
          handleChange={handleChangeCreateStudent}
          careers={careers}
          countries={countries}
          studentData={studentData}
        />
      )}

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
