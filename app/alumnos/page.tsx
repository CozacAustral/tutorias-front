"use client";
import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Select,
  Td,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
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
import { UpdateStudentDto } from "./interfaces/update-student.interface";
import CareerModal from "./modals/create-career-student.modal";
import CreateStudentModal from "./modals/create-student.modal";
import PaginateStudent from "./modals/paginate-student.modal";
import SubjectModal from "./modals/subject-student.modal";
import StudentModal from "./modals/view-student.modal";
import { CareerLike } from "./type/careerlike.type";

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
    undefined,
  );
  const [loadingRole, setLoadingRole] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingCareers, setLoadingCareers] = useState(true);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [role, setRole] = useState(0);
  type StudentLike = Student | { studentId: number };

  const isLoading =
    loadingRole ||
    loadingStudents ||
    loadingCareers ||
    (role !== 2 && loadingCountries);

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
    yearEntry: new Date(),
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
    if (!countries.length) return;

    setStudentData((prev) => {
      const exists = countries.some(
        (country) => country.id === Number(prev.countryId),
      );
      if (exists) return prev;

      return { ...prev, countryId: countries[0].id };
    });
  }, [countries]);

  useEffect(() => {
    if (!careers.length) return;

    setStudentData((prev) => {
      const exists = careers.some(
        (careerItem) => careerItem.id === Number(prev.careerId),
      );
      if (exists) return prev;

      return { ...prev, careerId: careers[0].id };
    });
  }, [careers]);

  useEffect(() => {
    const loadRole = async () => {
      setLoadingRole(true);
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
          const parsedRoleId = Number(raw);
          if (!Number.isNaN(parsedRoleId)) parsed = parsedRoleId;
          else {
            const roleString = raw.toUpperCase();
            if (roleString === "ADMIN") parsed = 1;
            if (roleString === "TUTOR") parsed = 2;
          }
        } else if (typeof raw === "object" && raw) {
          const objId = (raw as any).id;
          if (typeof objId === "number") parsed = objId;
        }

        setRole(parsed);
      } catch {
        setRole(0);
      } finally {
        setLoadingRole(false);
      }
    };

    loadRole();
  }, []);

  useEffect(() => {
    const loadStudents = async () => {
      setLoadingStudents(true);
      try {
        const data = await UserService.fetchStudentsByRole({
          search: searchTerm,
          currentPage,
          resultsPerPage: 7,
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
        setLoadingStudents(false);
      }
    };

    const token = Cookies.get("authTokens");
    if (!token) {
      return;
    }

    try {
      const jwt = require("jsonwebtoken");
      const decodedToken = jwt.decode(token);
      setRole(decodedToken?.role);
    } catch (error) {
      console.error("Error decoding token: ", error);
    }

    loadStudents();
  }, [currentPage, searchTerm, orderBy]);

  useEffect(() => {
    const loadCareers = async () => {
      setLoadingCareers(true);
      try {
        const fetchedCareers = await UserService.fetchAllCareers();
        setCareers(fetchedCareers);
      } catch (error) {
        console.error("Error fetching careers: ", error);
        setError("No se puedieron cargar las carreras.");
      } finally {
        setLoadingCareers(false);
      }
    };

    loadCareers();
  }, []);

  useEffect(() => {
    if (role === 2) {
      setLoadingCountries(false);
      setError(null);
      return;
    }

    const loadCountries = async () => {
      setLoadingCountries(true);
      try {
        const fetchedCountries = await UserService.fetchAllCountries();
        setCountries(fetchedCountries);
      } catch (error) {
        console.error("Error fetching countries: ", error);
        setError("No se pudieron cargar los países.");
      } finally {
        setLoadingCountries(false);
      }
    };

    loadCountries();
  }, [role]);

  const getStudentId = (student: StudentLike): number =>
    "studentId" in student ? student.studentId : student.id;

  const getCareerNames = (careers: StudentCareer[]): string[] => {
    return careers.map((career) => career.name);
  };

  const getCareerLabel = (careers: StudentCareer[]) => {
    const names = getCareerNames(careers);
    const full = names.join(", ");

    const short =
      names.length === 0
        ? "Sin carrera asignada"
        : names.length === 1
          ? names[0]
          : `${names[0]}...`;

    return { names, full, short };
  };

  const openStudent = async (student: Student, mode: "view" | "edit") => {
    const realId = getStudentId(student);
    const data = await loadStudentById(realId);
    if (!data) return;

    if (mode === "view") openViewModal();
    else openEditModal();
  };

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
        yearEntry: studentFetched.yearEntry || new Date(),

        observations: studentFetched.observations ?? "",

        countryId: studentFetched.countryId,
        email: studentFetched.user?.email || "",

        careers: studentFetched.careers || [],
      });

      return studentFetched;
    } catch (error) {}
  };

  const handleOpenCreateCareerModal = () => {
    if (!selectedStudent?.id) return;

    setCareerData((prev) => ({
      ...prev,
      studentId: selectedStudent.id,
      careerId: 0,
      yearOfAdmission: 0,
    }));

    openCreateCareerModal();
  };

  const handleChangeCreateStudent = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

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
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]:
        name === "birthdate" || name === "yearEntry"
          ? new Date(value).toISOString().split("T")[0]
          : name === "careerId" || name === "countryId"
            ? parseInt(value)
            : value,
    }));
  };

  const handleAddStudent = async () => {
    setCurrentPage(1);
    setSearchTerm("");

    const data = await UserService.fetchStudentsByRole({
      search: "",
      currentPage: 1,
      resultsPerPage: 7,
      orderBy,
    });

    if (data.students) {
      setStudents(data.students);
      setTotalStudents(data.totalCount);
    } else {
      setStudents(data.data);
      setTotalStudents(data.total);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedStudent) {
      try {
        await UserService.deleteStudent(selectedStudent.id);
        setStudents(
          students?.filter(
            (student) => student.user.id !== selectedStudent.user.id,
          ) || [],
        );
        closeDeleteModal();
      } catch (err) {
        console.error("Error al eliminar:", err);
      }
    }
  };

  const handleImport = async (_data?: any) => {
    setCurrentPage(1);
    setSearchTerm("");

    const data = await UserService.fetchStudentsByRole({
      search: "",
      currentPage: 1,
      resultsPerPage: 7,
      orderBy,
    });

    if (data.students) {
      setStudents(data.students);
      setTotalStudents(data.totalCount);
    } else {
      setStudents(data.data);
      setTotalStudents(data.total);
    }
  };

  const handleCreateClick = () => {
    setStudentData((prev) => ({
      ...prev,
      name: "",
      lastName: "",
      dni: "",
      email: "",
      telephone: "",
      birthdate: new Date().toISOString().split("T")[0],
      yearEntry: new Date().toISOString().split("T")[0],
      address: "",
      observations: "",
      countryId: countries[0]?.id ?? 0,
      careerId: careers[0]?.id ?? 0,
    }));

    openCreateModal();
  };

  const handleStudentUpdate = async () => {
    if (!selectedStudent) return;

    try {
      const payload: any = {
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        telephone: formData.telephone,
        dni: formData.dni,
        address: formData.address,
        birthdate: formData.birthdate,
        yearEntry: formData.yearEntry,
        countryId: formData.countryId,
      };

      if (role === 2) {
        payload.observations = formData.observations;
      }

      await UserService.updateStudent(selectedStudent.id, payload);

      const updatedStudent = await loadStudentById(selectedStudent.id);
      if (!updatedStudent) return;

      setStudents((previousStudents) =>
        previousStudents.map((student) =>
          getStudentId(student) === updatedStudent.id
            ? updatedStudent
            : student,
        ),
      );

      closeEditModal();
    } catch (error) {
      console.error("Error al editar estudiante:", error);
    }
  };

  const handleAllSubject = async (career: StudentCareer) => {
    setSelectedCareerState(career.active);

    if (!selectedStudent?.id || !career?.careerId) {
      return;
    }

    try {
      const careerSelected = await UserService.fetchCareers(career.careerId);
      setSelectedCareer(careerSelected);

      const allSubjects = await UserService.fetchStudentSubject(
        selectedStudent.id,
        careerSelected.id,
      );
      setSubjects(allSubjects);

      setTimeout(() => {
        openSujectModal();
      }, 0);
    } catch (error) {}
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
                newState,
              ),
            ),
          );
        }

        setSubjects((previousSubjects) =>
          previousSubjects.map((subject) => {
            const updatedState = editedSubjects[subject.subjectId];

            if (updatedState) {
              return {
                ...subject,
                subjectState: updatedState,
                updateAt: new Date(),
              };
            }

            return subject;
          }),
        );

        setEditedSubjects({});
      } catch (error) {
        console.error("Error al editar el estado de la materia:", error);
      }
    }
  };

  const getCareerStudentId = (career: StudentCareer): number => career.id;

  const normalizeCareersArray = (careers: unknown): CareerLike[] =>
    Array.isArray(careers) ? (careers as CareerLike[]) : [];

  const toStudentCareer = (rawCareer: CareerLike): StudentCareer | null => {
    const relationId =
      rawCareer.id ?? rawCareer.careerStudentId ?? rawCareer.career_student_id;

    const careerId =
      rawCareer.careerId ??
      rawCareer.career?.id ??
      rawCareer.career_id ??
      rawCareer.idCareer;

    const careerName =
      rawCareer.name ?? rawCareer.career?.name ?? rawCareer.name_career;

    if (!relationId || !careerId || !careerName) return null;

    return {
      id: relationId,
      careerId,
      name: careerName,
      yearEntry: rawCareer.yearEntry ?? 0,
      yearOfThePlan: rawCareer.yearOfThePlan ?? 0,
      active: rawCareer.active ?? false,
    };
  };

  const removeCareerFromArray = (
    careers: unknown,
    relId: number,
    careerId: number,
    careerName?: string,
  ): StudentCareer[] => {
    const targetName = careerName?.trim().toLowerCase();

    return normalizeCareersArray(careers)
      .filter((careerItem) => {
        const relationIdCandidate = Number(
          careerItem.id ??
            careerItem.careerStudentId ??
            careerItem.career_student_id,
        );

        const careerIdCandidate = Number(
          careerItem.careerId ??
            careerItem.career?.id ??
            careerItem.career_id ??
            careerItem.idCareer,
        );

        const normalizedCareerName = (
          careerItem.name ??
          careerItem.career?.name ??
          careerItem.name_career ??
          ""
        )
          .toString()
          .trim()
          .toLowerCase();

        if (relId && !Number.isNaN(relId) && relationIdCandidate === relId)
          return false;
        if (
          careerId &&
          !Number.isNaN(careerId) &&
          careerIdCandidate === careerId
        )
          return false;
        if (targetName && normalizedCareerName === targetName) return false;

        return true;
      })
      .map(toStudentCareer)
      .filter(
        (studentCareer): studentCareer is StudentCareer =>
          studentCareer !== null,
      );
  };

  const onDeleteCareer = async (career: StudentCareer) => {
    if (!selectedStudent) return;

    const relId = getCareerStudentId(career);
    const studentId = selectedStudent.id;
    const careerId = career.careerId;

    if (!relId || Number.isNaN(relId)) {
      console.error("No hay CareerStudent.id en el objeto career:", career);
      return;
    }

    try {
      await UserService.deleteCareerStudent([relId]);
      setFormData((prev) => ({
        ...prev,
        careers: removeCareerFromArray(
          prev.careers ?? [],
          relId,
          careerId,
          career.name,
        ),
      }));

      setSelectedStudent((prev: Student | null) =>
        prev
          ? {
              ...prev,
              careers: removeCareerFromArray(
                prev.careers as any,
                relId,
                careerId,
                career.name,
              ),
            }
          : prev,
      );
      setStudents((previousStudents) =>
        previousStudents.map((student: Student) => {
          const studentIdValue = getStudentId(student);
          if (studentIdValue !== studentId) return student;

          return {
            ...student,
            careers: removeCareerFromArray(
              (student as any).careers,
              relId,
              careerId,
              career.name,
            ),
          };
        }),
      );
    } catch (error) {}
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
          }),
        );
      }
    }
    setEditSubjectId(subjectId);
    setOpenSubjectState(true);
  };

  const handleChangeCreateCareer = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    if (name === "careerId") {
      const selectedCareerItem = careers.find(
        (careerItem) => careerItem.id === parseInt(value),
      );
      setSelectedCareer(selectedCareerItem || null);
    }

    setCareerData((previousCareerData) => ({
      ...previousCareerData,
      [name]:
        name === "yearOfAdmission"
          ? parseInt(value)
          : name === "careerId"
            ? parseInt(value)
            : value,
    }));
  };

  const handleCreateCareer = async () => {
    if (selectedStudent?.id && selectedCareer?.id) {
      try {
        await UserService.createCareer(careerData);

        const updatedStudent = await loadStudentById(selectedStudent.id);
        if (!updatedStudent) return;

        setStudents((prev) =>
          prev.map((student) => {
            const studentId = getStudentId(student);
            if (studentId !== updatedStudent.id) return student;

            return {
              ...student,
              careers: updatedStudent.careers,
            };
          }),
        );
        closeCreateCareerModal();
      } catch (error) {
        console.error("Error creando carrera:", error);
      }
    }
  };

  const handleCloseModalSubject = () => {
    setEditedSubjects({});
    closeSubjectModal();
  };

  const actionBtnProps = {
    backgroundColor: "white",
    _hover: {
      borderRadius: 15,
      backgroundColor: "#318AE4",
      color: "White",
    },
  } as const;

  const dangerBtnProps = {
    backgroundColor: "white",
    _hover: {
      borderRadius: 15,
      backgroundColor: "#E53E3E",
      color: "White",
    },
  } as const;

  const renderStudentRow = (student: Student) => {
    const { names, full, short } = getCareerLabel(student.careers);
    const canDelete = role !== 2;

    return (
      <Tr key={student.id}>
        <Td>{student.user?.name}</Td>
        <Td>{student.user?.lastName}</Td>
        <Td>{student.telephone}</Td>
        <Td>{student.user?.email}</Td>

        <Td>
          {names.length > 1 ? (
            <Tooltip label={full} hasArrow>
              <span>{short}</span>
            </Tooltip>
          ) : (
            short
          )}
        </Td>

        <Td>
          <IconButton
            {...actionBtnProps}
            icon={<ViewIcon boxSize={5} />}
            aria-label="View"
            mr={5}
            onClick={() => openStudent(student, "view")}
          />
          <IconButton
            {...actionBtnProps}
            icon={<EditIcon boxSize={5} />}
            aria-label="Edit"
            mr={5}
            onClick={() => openStudent(student, "edit")}
          />
          {canDelete && (
            <IconButton
              {...dangerBtnProps}
              icon={<DeleteIcon boxSize={5} />}
              aria-label="Delete"
              onClick={() => handleDeleteClick(student)}
            />
          )}
        </Td>
      </Tr>
    );
  };

  const renderCareerRow = (career: StudentCareer) => (
    <Tr key={career.careerId}>
      <Td>{career.name}</Td>
      <Td>{career.active ? "Activa" : "Inactiva"}</Td>
      <Td>{career.yearEntry}</Td>
      <Td>
        <IconButton
          {...actionBtnProps}
          icon={<ViewIcon boxSize={5} />}
          aria-label="View"
          mr={5}
          onClick={() => handleAllSubject(career)}
        />

        <IconButton
          {...actionBtnProps}
          icon={<EditIcon boxSize={5} />}
          aria-label="Edit"
          mr={5}
          onClick={() => handleAllSubject(career)}
        />

        {role === 1 ? (
          <IconButton
            {...dangerBtnProps}
            icon={<DeleteIcon boxSize={5} />}
            aria-label="Delete"
            onClick={() => onDeleteCareer(career)}
          />
        ) : null}
      </Td>
    </Tr>
  );

  const renderSubjectRowView = (
    subject: SubjectCareerWithState,
    index: number,
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
            onChange={(selectChangeEvent) =>
              setEditedSubjects((previousEditedSubjects) => ({
                ...previousEditedSubjects,
                [subject.subjectId]: selectChangeEvent.target.value,
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
        renderSubjectNow={(subjectItem, index) =>
          renderSubjectRow(subjectItem, index)
        }
        renderSubjectNowView={(subjectItem, index) =>
          renderSubjectRowView(subjectItem, index)
        }
        onConfirmEditSubject={handleEditSubject}
        countries={countries}
      />

      <StudentModal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        formData={{ ...formData, id: selectedStudent?.id }}
        isViewMode={true}
        role={role}
        renderSubjectNowView={(subjectItem, index) =>
          renderSubjectRowView(subjectItem, index)
        }
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
