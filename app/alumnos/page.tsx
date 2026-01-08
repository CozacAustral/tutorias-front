"use client";
import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Select,
  Td,
  Tooltip,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import DeleteModal from "../../common/components/modals/detele.modal";
import ImportModal from "../../common/components/modals/import.modal";
import { UserService } from "../../services/admin-service";
import { CreateStudent } from "../carrera/interfaces/create-student.interface";
import { SubjectState } from "../enums/subject-state.enum";
import { Career } from "./interfaces/career.interface";
import { Country } from "./interfaces/country.interface";
import { AssignedCareer } from "./interfaces/create-career.interface";
import { StudentCareer } from "./interfaces/student-career.interface";
import { Student } from "./interfaces/student.interface";
import { SubjectCareerWithState } from "./interfaces/subject-career-student.interface";
import { UpdateStudentDto } from "./interfaces/update-student";
import CareerModal from "./modals/create-career-student.modal";
import CreateStudentModal from "./modals/create-student.modal";
import PaginateStudent from "./modals/paginate-student.modal";
import SubjectModal from "./modals/subject-student.modal";
import StudentModal from "./modals/view-student.modal";

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
        id: 0,
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
    const loadRole = async () => {
      try {
        const me = await UserService.fetchMe();
        const raw =
          (me as any).roleId ??
          (me as any).role?.id ??
          (me as any).role ??
          (me as any).user?.roleId ??
          (me as any).user?.role?.id;

        let parsed = 0;

        if (typeof raw === "number") parsed = raw;
        else if (typeof raw === "string") {
          const n = Number(raw);
          if (!Number.isNaN(n)) parsed = n;
          else {
            const r = raw.toUpperCase();
            if (r === "ADMIN") parsed = 1;
            if (r === "TUTOR") parsed = 2;
          }
        } else if (typeof raw === "object" && raw) {
          const objId = (raw as any).id;
          if (typeof objId === "number") parsed = objId;
        }

        setRole(parsed);
      } catch {
        setRole(0);
      }
    };

    loadRole();
  }, []);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await UserService.fetchStudentsByRole({
          search: searchTerm,
          currentPage,
          resultsPerPage: 10,
          orderBy,
        });

        if (data.students) {
          setStudents(data.students);
          setTotalStudents(data.totalCount);
        } else {
          setStudents(data.data);
          setTotalStudents(data.total);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("No se pudieron cargar los estudiantes.");
      } finally {
        setLoading(false);
      }
    };

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

  const loadStudentById = async (id: number) => {
    try {
      const studentFetched = await UserService.getOneStudentByRole(id);

      setSelectedStudent(studentFetched);

      setFormData({
        id: studentFetched.id,
        name: studentFetched.user?.name || "",
        lastName: studentFetched.user?.lastName || "",
        dni: studentFetched.dni || "",
        telephone: studentFetched.telephone || "",
        birthdate: studentFetched.birthdate || new Date(),
        address: studentFetched.address || "",
        year: studentFetched.yearEntry || new Date(),

        observations: studentFetched.observations ?? "",

        countryId: studentFetched.countryId,
        email: studentFetched.user?.email || "",

        careers: studentFetched.careers || [],
      });

      return studentFetched;
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo obtener los datos del estudiante",
        status: "error",
      });
    }
  };

  const handleOpenCreateCareerModal = () => {
    if (!selectedStudent?.id) return;

    setCareerData((prev) => ({
      ...prev,
      studentId: selectedStudent.id, // ✅ ACÁ
      careerId: 0,
      yearOfAdmission: 0,
    }));

    openCreateCareerModal();
  };

  const handleEditClick = async (student: any) => {
    const realId = student.studentId ?? student.id;
    const data = await loadStudentById(realId);
    if (data) openEditModal();
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
          ? new Date(value).toISOString().split("T")[0]
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

  const handleViewClick = async (student: any) => {
    const realId = student.studentId ?? student.id;
    const data = await loadStudentById(realId);
    if (data) openViewModal();
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
        selectedStudent.id,
        careerSelected.id
      );
      setSubjects(allSubjects);

      setTimeout(() => {
        openSujectModal();
      }, 0);
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

  const onDeleteCareer = async (career: StudentCareer) => {
    if (!selectedStudent) return;

    try {
      await UserService.deleteCareerStudent([career.id]);

      setFormData((prev) => ({
        ...prev,
        careers: prev.careers.filter((c) => c.id !== career.id),
      }));

      toast({
        title: "Carrera eliminada",
        description: `La carrera "${career.name}" fue desasignada del alumno.`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la carrera.",
        status: "error",
      });
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

const renderStudentRow = (student: Student) => {
  const studentCareers = Array.isArray((student as any).careers)
    ? (student as any).careers
    : [];

  const careerNames = studentCareers
    .map((c: any) => c?.name ?? c?.career?.name ?? c?.name_career)
    .filter(Boolean) as string[];

  const full = careerNames.join(", ");
  const short =
    careerNames.length === 0
      ? "No name available"
      : careerNames.length === 1
        ? careerNames[0]
        : `${careerNames[0]} +${careerNames.length - 1}…`;

  return (
    <Tr key={student.id}>
      <Td>{student.user?.name}</Td>
      <Td>{student.user?.lastName}</Td>
      <Td>{student.telephone}</Td>
      <Td>{student.user?.email}</Td>

      <Td>
        {careerNames.length > 1 ? (
          <Tooltip label={full} hasArrow>
            <span>{short}</span>
          </Tooltip>
        ) : (
          short
        )}
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
        </Td>
      )}
    </Tr>
  );
};


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
              onClick={() => handleAllSubject(career)}
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

            {role === 1 ? (
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
            ) : null}
          </>
        )}
      </Td>
    </Tr>
  );

  const renderSubjectRowView = (
    subject: SubjectCareerWithState,
    index: number
  ) => (
    <Tr key={subject.subjectId ?? index}>
      <Td>{subject.subjectName}</Td>
      <Td>{subject.year}</Td>
      <Td>{SubjectState[subject.subjectState as keyof typeof SubjectState]}</Td>
      <Td>
        {subject.updateAt
          ? new Date(subject.updateAt).toLocaleDateString()
          : "-"}
      </Td>
    </Tr>
  );

  const renderSubjectRow = (subject: SubjectCareerWithState, index: number) => (
    <Tr key={subject.subjectId ?? index}>
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
        {role === 1 || role === 2 ? (
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
        ) : null}
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

      <StudentModal
        onAddCareer={handleOpenCreateCareerModal}
        onDeleteCareer={onDeleteCareer}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onConfirm={handleStudentUpdate}
        formData={{ ...formData, id: selectedStudent?.id }}
        onInputChange={handleChange}
        isViewMode={false}
        role={role}
        renderSubjectNow={(s, i) => renderSubjectRow(s, i)}
        renderSubjectNowView={(s, i) => renderSubjectRowView(s, i)}
        onConfirmEditSubject={handleEditSubject}
        countries={countries}
      />

      <StudentModal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        formData={{ ...formData, id: selectedStudent?.id }}
        isViewMode={true}
        role={role}
        renderSubjectNowView={(s, i) => renderSubjectRowView(s, i)}
        countries={countries}
      />

      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={handleCloseModalSubject}
        onConfirm={handleEditSubject}
        subjects={subjects}
        renderSubjectNow={(subject, index) => renderSubjectRow(subject, index)}
        titleCareer={selectedCareer?.name}
        entityName="Materias"
        state={selectedCareerState}
        role={role}
        showButtonCancelSave={role !== 2}
      />

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
