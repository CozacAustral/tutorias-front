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
import React, { useEffect, useState, Suspense } from "react"; // Importamos Suspense
import { FaRegCalendarAlt } from "react-icons/fa";
import DeleteModal from "../../common/components/modals/detele.modal";
import EditModal from "../../common/components/modals/edit.modal";
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
import ViewStudentModal from "./modals/view-student.modal";

// 1. Renombramos el componente original a EstudiantesContent
const EstudiantesContent: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [selectedCareerState, setSelectedCareerState] = useState<boolean | null>(null);
  const [subjects, setSubjects] = useState<SubjectCareerWithState[]>([]);
  const [editedSubjects, setEditedSubjects] = useState<{ [subjectId: number]: string }>({});
  const [editSubjectId, setEditSubjectId] = useState<number | null>(null);
  const [openSubjectState, setOpenSubjectState] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalStudents, setTotalStudents] = useState(0);
  const [orderBy, setOrderBy] = useState<[string, "ASC" | "DESC"] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(0);

  const toast = useToast();
  const jwt = require("jsonwebtoken");

  const { isOpen: isEditModalOpen, onOpen: openEditModal, onClose: closeEditModal } = useDisclosure();
  const { isOpen: isImportModalOpen, onOpen: openImportModal, onClose: closeImportModal } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: openDeleteModal, onClose: closeDeleteModal } = useDisclosure();
  const { isOpen: isCreateModalOpen, onOpen: openCreateModal, onClose: closeCreateModal } = useDisclosure();
  const { isOpen: isViewModalOpen, onOpen: openViewModal, onClose: closeViewModal } = useDisclosure();
  const { isOpen: isSubjectModalOpen, onOpen: openSujectModal, onClose: closeSubjectModal } = useDisclosure();
  const { isOpen: isCreateCareerModalOpen, onOpen: openCreateCareerModal, onClose: closeCreateCareerModal } = useDisclosure();

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
    careers: [{ careerId: 0, name: "", active: false, yearEntry: 0, yearOfThePlan: 0 }],
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

  const TableHeader = ["Nombre", "Apellido", "Num. Celular", "Correo", "Carrera/s"];
  const TableHeaderTutor = ["Apellido/s", "Nombre", "Correo", "Nro de telefono", "Carrera/s"];

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
    if (!token) return;

    try {
      const decodedToken = jwt.decode(token);
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
        setError("No se puedieron cargar las carreras.");
      }
    };
    loadCareers();
  }, []);

  useEffect(() => {
    if (role === 2) {
      setLoading(false);
      return;
    }
    const loadCountries = async () => {
      try {
        const fetchedCountries = await UserService.fetchAllCountries();
        setCountries(fetchedCountries);
      } catch (error) {
        setError("No se pudieron cargar los países.");
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
      toast({ title: "Error", description: "No se pudo obtener los datos", status: "error" });
    }
  };

  const handleChangeCreateStudent = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({
      ...prev,
      [name]: name === "birthdate" || name === "yearEntry" ? value : (name === "careerId" || name === "countryId" ? parseInt(value) : value),
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "birthdate" || name === "yearEntry" ? new Date(value).toISOString().split("T")[0] : (name === "careerId" || name === "countryId" ? parseInt(value) : value),
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
        setStudents(students?.filter((s) => s.user.id !== selectedStudent.user.id) || []);
        toast({ title: "Eliminado", status: "success" });
        closeDeleteModal();
      } catch (err) {
        toast({ title: "Error", status: "error" });
      }
    }
  };

  const handleImport = (data: any) => console.log("imported", data);
  const handleCreateClick = () => openCreateModal();

  const handleCreateCareerClick = () => {
    if (selectedStudent?.id) {
      setCareerData({ careerId: 0, studentId: selectedStudent.id, yearOfAdmission: new Date().getFullYear() });
      openCreateCareerModal();
    }
  };

  const handleViewClick = (student: Student) => {
    if (student?.user) {
      setSelectedStudent(student);
      setFormData({
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
      });
      openViewModal();
    }
  };

  const handleStudentUpdate = async () => {
    if (selectedStudent) {
      try {
        const updated = await UserService.updateStudentModal(selectedStudent.id, formData.lastName, formData.name, formData.email, formData.telephone, formData.observations);
        setFormData(updated);
        setStudents((prev) => prev.map((s) => (s.id === selectedStudent.id ? { ...s, user: { ...s.user, name: formData.name, lastName: formData.lastName, email: formData.email }, telephone: formData.telephone, observations: formData.observations } : s)));
        toast({ title: "Actualizado", status: "success" });
        closeEditModal();
      } catch (error) {
        toast({ title: "Error", status: "error" });
      }
    }
  };

  const handleAllSubject = async (career: StudentCareer) => {
    setSelectedCareerState(career.active);
    if (!selectedStudent?.id || !career?.careerId) return;
    try {
      const careerSelected = await UserService.fetchCareers(career.careerId);
      setSelectedCareer(careerSelected);
      const allSubjects = await UserService.fetchStudentSubject(selectedStudent?.id, careerSelected.id);
      setSubjects(allSubjects);
      openSujectModal();
    } catch (error) {
      toast({ title: "Error", status: "error" });
    }
  };

  const handleEditSubject = async () => {
    setOpenSubjectState(false);
    setEditSubjectId(null);
    if (selectedStudent) {
      try {
        const updates = Object.entries(editedSubjects);
        if (updates.length > 0) {
          await Promise.all(updates.map(([id, state]) => UserService.updateStateSubject(selectedStudent.id, parseInt(id), state)));
        }
        setSubjects((prev) => prev.map((s) => editedSubjects[s.subjectId] ? { ...s, subjectState: editedSubjects[s.subjectId], updateAt: new Date() } : s));
        setEditedSubjects({});
        toast({ title: "Materias actualizadas", status: "success" });
      } catch (error) {
        toast({ title: "Error", status: "error" });
      }
    }
  };

  const handleEditSubjectClick = async (subjectId: number) => {
    setEditSubjectId(subjectId);
    setOpenSubjectState(true);
  };

  const handleChangeCreateCareer = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "careerId") setSelectedCareer(careers.find((c) => c.id === parseInt(value)) || null);
    setCareerData((prev) => ({ ...prev, [name]: name === "yearOfAdmission" || name === "careerId" ? parseInt(value) : value }));
  };

  const handleCreateCareer = async () => {
    if (selectedStudent?.id && selectedCareer?.id) {
      try {
        await UserService.createCareer(careerData);
        const updated = await UserService.fetchStudent(selectedStudent.id);
        setFormData((prev) => ({ ...prev, careers: updated.careers }));
        toast({ title: "Carrera creada", status: "success" });
        closeCreateCareerModal();
      } catch (error) {
        toast({ title: "Error", status: "error" });
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
      <Td>{student.careers?.length ? student.careers[0]?.name : "N/A"}</Td>
      <Td>
        <IconButton icon={<ViewIcon />} aria-label="View" onClick={() => handleViewClick(student)} mr={2} />
        {role !== 2 && (
          <>
            <IconButton icon={<EditIcon />} aria-label="Edit" onClick={() => handleEditClick(student)} mr={2} />
            <IconButton icon={<DeleteIcon />} aria-label="Delete" onClick={() => handleDeleteClick(student)} />
          </>
        )}
      </Td>
    </Tr>
  );

  const renderCareerRow = (career: StudentCareer) => (
    <Tr key={career.careerId}>
      <Td>{career.name}</Td>
      <Td>{career.active ? "Activa" : "Inactiva"}</Td>
      <Td>{career.yearEntry}</Td>
      <Td>
        <IconButton icon={<ViewIcon />} aria-label="View" onClick={() => handleAllSubject(career)} mr={2} />
        {role !== 2 && <IconButton icon={<EditIcon />} aria-label="Edit" onClick={() => handleAllSubject(career)} />}
      </Td>
    </Tr>
  );

  const renderSubjectRow = (subject: SubjectCareerWithState) => (
    <Tr key={subject.subjectId}>
      <Td>{subject.subjectName}</Td>
      <Td>{subject.year}</Td>
      <Td>
        {editedSubjects[subject.subjectId] !== undefined ? (
          <Select value={editedSubjects[subject.subjectId]} onChange={(e) => setEditedSubjects((p) => ({ ...p, [subject.subjectId]: e.target.value }))}>
            {Object.entries(SubjectState).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </Select>
        ) : (
          SubjectState[subject.subjectState as keyof typeof SubjectState]
        )}
      </Td>
      <Td>{subject.updateAt ? new Date(subject.updateAt).toLocaleDateString() : "-"}</Td>
      <Td>
        {role !== 2 && <IconButton icon={<EditIcon />} aria-label="Edit" onClick={() => handleEditSubjectClick(subject.subjectId)} />}
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
        showAddMenu={role !== 2}
        onImportOpen={role !== 2 ? openImportModal : undefined}
        onCreateOpen={role !== 2 ? handleCreateClick : undefined}
        currentPage={currentPage}
        totalItems={totalStudents}
        onPageChange={setCurrentPage}
        searchTerm={searchTerm}
        onSearch={(t) => { setSearchTerm(t); setCurrentPage(1); }}
        orderBy={orderBy}
        onOrderChange={handleOrderChange}
      />
      <EditModal isOpen={isEditModalOpen} onClose={closeEditModal} onConfirm={handleStudentUpdate} formData={formData} onInputChange={handleChange} title="Editar Alumno" entityName="Alumno" renderCareerNow={renderCareerRow} createOpen={handleCreateCareerClick} showButtonCancelSave={true} role={role} />
      <SubjectModal isOpen={isSubjectModalOpen} onClose={handleCloseModalSubject} onConfirm={handleEditSubject} subjects={subjects} renderSubjectNow={renderSubjectRow} titleCareer={selectedCareer?.name} entityName="Materias" state={selectedCareerState} role={role} showButtonCancelSave={role !== 2} />
      <CareerModal isOpen={isCreateCareerModalOpen} onClose={closeCreateCareerModal} onConfirm={handleCreateCareer} careerData={careerData} handleChange={handleChangeCreateCareer} careers={careers} />
      {role !== 2 && <ImportModal isOpen={isImportModalOpen} onClose={closeImportModal} onImport={handleImport} />}
      <EditModal isOpen={isViewModalOpen} onClose={closeViewModal} onConfirm={handleStudentUpdate} formData={formData} onInputChange={handleChange} caption="Ver Alumno" renderCareerNow={renderCareerRow} createOpen={handleCreateCareerClick} forTutor={role === 2} isViewModal={true} showButtonCancelSave={false} />
      {role !== 2 && <CreateStudentModal isOpen={isCreateModalOpen} onClose={closeCreateModal} onAddStudent={handleAddStudent} handleChange={handleChangeCreateStudent} careers={careers} countries={countries} studentData={studentData} />}
      <DeleteModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} onDelete={handleDeleteConfirm} entityName="alumno" entityDetails={`${selectedStudent?.user.name} ${selectedStudent?.user.lastName}`} />
    </>
  );
};

// 2. Exportación final con Suspense para evitar errores en Vercel
export default function Estudiantes() {
  return (
    <Suspense fallback={<p>Cargando alumnos...</p>}>
      <EstudiantesContent />
    </Suspense>
  );
}
