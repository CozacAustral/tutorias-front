"use client";
import { DeleteIcon, EditIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Select,
  Td,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FiFilePlus, FiFileText } from "react-icons/fi";
import GenericTable from "../../common/components/generic-table";
import { UserService } from "../../services/admin-service";
import { Country } from "../alumnos/interfaces/country.interface";
import { SubjectCareerWithState } from "../alumnos/interfaces/subject-career-student.interface";
import SubjectModal from "../alumnos/modals/subject-student.modal";
import StudentModal from "../alumnos/modals/view-student.modal";
import { useSidebar } from "../contexts/SidebarContext";
import { useMeetings } from "./hooks/use-meetings.hook";
import { MeUserLike, useRole } from "./hooks/use-role.hook";
import { useStudentOptions } from "./hooks/use-student-options.hook";
import { useSubjectsModal } from "./hooks/use-subject-modal.hook";
import ConfirmDialog from "./modals/confirm-dialog-modal";
import CreateReportModal from "./modals/create-report-modal";
import EditMeetingModal from "./modals/edit-meeting-modal";
import FilterMeetingsModal from "./modals/filtro-busqueda-modal";
import ScheduleMeetingModal from "./modals/schedule-meetings-modals";
import ViewReportModal from "./modals/view-report-modal";
import { MeetingRow } from "./type/meeting-row.type";
import { Row } from "./type/rows.type";
import { SelectedStudentFormData } from "./type/selected-student-form-data.type";
import { StudentOption } from "./type/student-option.type";
import { statusBadge } from "./utils/status-badge.utils";
import { subjectStateValueForSelect } from "./utils/subjects.utils";

function toMeetingRow(row: Row): MeetingRow {
  return {
    ...row,
    fechaHora: row.fechaHora ?? `${row.fecha} ${row.hora}`,
    status: row.status === "COMPLETED",
  } as MeetingRow;
}

const Reuniones: React.FC = () => {
  const initialRef = useRef<HTMLInputElement | null>(null);
  const cancelDeleteRef = useRef<HTMLButtonElement | null>(null);

  const { collapsed } = useSidebar();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [me, setMe] = useState<MeUser | null>(null);
  const { isAdmin, isTutor, normalizedRole } = useRole(me as MeUserLike);

  const limit = 7;
  const {
    page,
    setPage,
    rows,
    total,
    loading,
    myTutorId,
    filters,
    setFilters,
    loadMeetings,
  } = useMeetings(limit);

  const { studentsOptions, setStudentsOptions, loadStudentsForFilter } =
    useStudentOptions({
      isTutor,
      isAdmin,
      meExists: Boolean(me),
      myTutorId,
    });

  const subjectsModal = useSubjectsModal();

  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedStudent, setSelectedStudent] =
    useState<SelectedStudentFormData | null>(null);

  const [meetingToEdit, setMeetingToEdit] = useState<MeetingRow | null>(null);
  const [rowToDelete, setRowToDelete] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [reportMeetingId, setReportMeetingId] = useState<number | null>(null);
  const [reportStudentId, setReportStudentId] = useState<number | null>(null);

  const [viewMeetingId, setViewMeetingId] = useState<number | null>(null);
  const [viewStudentId, setViewStudentId] = useState<number | null>(null);

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isFilterOpen,
    onOpen: onFilterOpen,
    onClose: onFilterClose,
  } = useDisclosure();

  const {
    isOpen: isReportOpen,
    onOpen: onReportOpen,
    onClose: onReportClose,
  } = useDisclosure();

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

  const {
    isOpen: isSubjectsOpen,
    onOpen: onSubjectsOpen,
    onClose: onSubjectsClose,
  } = useDisclosure();

  const {
    isOpen: isStudentOpen,
    onOpen: onStudentOpen,
    onClose: onStudentClose,
  } = useDisclosure();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      const user = await UserService.fetchMe();
      if (!user) {
        router.replace("/login");
        return;
      }
      setMe(user);
    };
    init();
  }, [router]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const res = await UserService.fetchAllCountries();
        setCountries(res);
      } catch {
        setCountries([]);
      }
    };
    loadCountries();
  }, []);

  const isStudent = useMemo(() => !isTutor && !isAdmin, [isTutor, isAdmin]);

  const headers = useMemo(() => {
    if (isTutor)
      return ["Alumno", "Fecha", "Hora", "Aula", "Status", "Acciones"];
    if (isAdmin) return ["Alumno", "Fecha", "Hora", "Aula", "Status"];
    return ["Fecha", "Hora", "Aula"];
  }, [isTutor, isAdmin]);

  const loadStudentById = useCallback(async (id: number) => {
    try {
      const studentFetched = await UserService.getOneStudentByRole(id);
      setSelectedStudent({
        id: studentFetched.id,
        name: studentFetched.user?.name ?? "",
        lastName: studentFetched.user?.lastName ?? "",
        email: studentFetched.user?.email ?? "",
        telephone: studentFetched.telephone ?? "",
        dni: studentFetched.dni ?? "",
        address: studentFetched.address ?? "",
        observations: studentFetched.observations ?? "",
        countryId: studentFetched.countryId,
        careers: studentFetched.careers ?? [],
      });
      return studentFetched;
    } catch {
      return null;
    }
  }, []);

  const openCreate = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("openCreate", "1");
    router.replace(`/reuniones?${params.toString()}`, { scroll: false });
    onCreateOpen();
    setTimeout(() => initialRef.current?.focus(), 0);
  }, [router, searchParams, onCreateOpen]);

  const requestDelete = useCallback((row: Row) => {
    setRowToDelete(row);
    setIsDeleteOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!rowToDelete) return;
    try {
      setDeleting(true);
      await UserService.deleteMeeting(rowToDelete.id);
      setIsDeleteOpen(false);
      setRowToDelete(null);
      loadMeetings(page);
    } catch {
    } finally {
      setDeleting(false);
    }
  }, [rowToDelete, loadMeetings, page]);

  const handleEdit = useCallback(
    (row: Row) => {
      setMeetingToEdit(toMeetingRow(row));
      onEditOpen();
    },
    [onEditOpen],
  );

  const renderRow = useCallback(
    (row: Row) => (
      <Tr key={row.id}>
        {(isTutor || isAdmin) && (
          <Td
            cursor={isTutor ? "pointer" : "default"}
            color={isTutor ? "blue.500" : "inherit"}
            fontWeight={isTutor ? "medium" : "normal"}
            _hover={isTutor ? { textDecoration: "underline" } : undefined}
            onClick={async () => {
              if (!isTutor || !row.studentId) return;
              const data = await loadStudentById(row.studentId);
              if (data) onStudentOpen();
            }}
          >
            {row.alumno}
          </Td>
        )}

        <Td>{row.fecha}</Td>
        <Td>{row.hora}</Td>
        <Td>{row.aula}</Td>

        {(isTutor || isAdmin) && <Td>{statusBadge(row.status)}</Td>}

        {isTutor && (
          <Td>
            <HStack spacing={2}>
              {row.status !== "COMPLETED" && (
                <>
                  <IconButton
                    aria-label="Editar reunión"
                    icon={<EditIcon boxSize={5} />}
                    backgroundColor="white"
                    _hover={{
                      borderRadius: 15,
                      backgroundColor: "#318AE4",
                      color: "white",
                    }}
                    onClick={() => handleEdit(row)}
                  />

                  <IconButton
                    aria-label="Eliminar reunión"
                    icon={<DeleteIcon boxSize={5} />}
                    backgroundColor="white"
                    _hover={{
                      borderRadius: 15,
                      backgroundColor: "red.500",
                      color: "white",
                    }}
                    onClick={() => requestDelete(row)}
                  />
                </>
              )}

              {row.status !== "PENDING" &&
                (row.status === "REPORTMISSING" ? (
                  <IconButton
                    aria-label="Crear reporte"
                    icon={<FiFilePlus />}
                    backgroundColor="white"
                    _hover={{
                      borderRadius: 15,
                      backgroundColor: "#318AE4",
                      color: "white",
                    }}
                    onClick={() => {
                      setReportMeetingId(row.id);
                      setReportStudentId(row.studentId ?? null);
                      onReportOpen();
                    }}
                  />
                ) : (
                  <IconButton
                    aria-label="Ver reporte"
                    icon={<FiFileText />}
                    backgroundColor="white"
                    _hover={{
                      borderRadius: 15,
                      backgroundColor: "#318AE4",
                      color: "white",
                    }}
                    onClick={() => {
                      setViewMeetingId(row.id);
                      setViewStudentId(row.studentId ?? null);
                      onViewOpen();
                    }}
                  />
                ))}
            </HStack>
          </Td>
        )}
      </Tr>
    ),
    [
      isTutor,
      isAdmin,
      handleEdit,
      requestDelete,
      onReportOpen,
      onViewOpen,
      loadStudentById,
      onStudentOpen,
    ],
  );

  const renderSubjectNow = useCallback(
    (subject: SubjectCareerWithState) => {
      const { selectValue, label } = subjectsModal.renderSubjectRow(subject);

      return (
        <Tr key={subject.subjectId}>
          <Td>{subject.subjectName}</Td>
          <Td>{subject.year}</Td>

          <Td>
            {subjectsModal.editedSubjects[subject.subjectId] !== undefined ? (
              <Select
                value={selectValue}
                onChange={(e) =>
                  subjectsModal.setEditedSubjects((prev) => ({
                    ...prev,
                    [subject.subjectId]: e.target.value,
                  }))
                }
              >
                <option value="APPROVED">Aprobada</option>
                <option value="REGULARIZED">Regularizada</option>
                <option value="FREE">Libre</option>
                <option value="INPROGRESS">En curso</option>
                <option value="NOTATTENDED">No cursada</option>
                <option value="RETAKING">Recursando</option>
              </Select>
            ) : (
              label
            )}
          </Td>

          <Td>
            {subject.updateAt
              ? new Date(subject.updateAt).toLocaleDateString("es-AR")
              : "-"}
          </Td>

          <Td>
            <IconButton
              icon={<EditIcon boxSize={5} />}
              aria-label="Editar"
              backgroundColor={
                subjectsModal.editedSubjects[subject.subjectId] !== undefined
                  ? "#318AE4"
                  : "white"
              }
              _hover={{
                borderRadius: 15,
                backgroundColor: "#318AE4",
                color: "white",
              }}
              onClick={() =>
                subjectsModal.setEditedSubjects((prev) => ({
                  ...prev,
                  [subject.subjectId]: subjectStateValueForSelect(
                    subject.subjectState,
                  ),
                }))
              }
            />
          </Td>
        </Tr>
      );
    },
    [subjectsModal],
  );

  return (
    <>
      <Box pl={collapsed ? "6.5rem" : "17rem"} px={5}>
        <GenericTable<Row>
          showAddMenu={false}
          caption="Reuniones"
          data={rows}
          TableHeader={headers}
          renderRow={renderRow}
          currentPage={page}
          totalItems={total}
          itemsPerPage={limit}
          onPageChange={setPage}
          filter={false}
          actions={false}
          hasSidebar
          topRightComponent={
            <HStack>
              {(isTutor || isAdmin) && (
                <Button
                  leftIcon={<SearchIcon />}
                  variant="outline"
                  onClick={onFilterOpen}
                >
                  Filtros
                </Button>
              )}

              {isTutor && (
                <Button onClick={openCreate} isLoading={loading}>
                  + Agendar
                </Button>
              )}
            </HStack>
          }
          minH="500px"
        />
      </Box>

      <ScheduleMeetingModal
        isOpen={isCreateOpen}
        onClose={() => {
          onCreateClose();
          const params = new URLSearchParams(searchParams.toString());
          params.delete("openCreate");
          router.replace(`/reuniones?${params.toString()}`, { scroll: false });
        }}
        students={studentsOptions as StudentOption[]}
        onCreated={() => loadMeetings(page)}
      />

      <EditMeetingModal
        isOpen={isEditOpen}
        onClose={() => {
          onEditClose();
          setMeetingToEdit(null);
        }}
        meeting={meetingToEdit}
        onUpdated={() => loadMeetings(page)}
      />

      <FilterMeetingsModal
        isOpen={isFilterOpen}
        onClose={onFilterClose}
        students={studentsOptions}
        loadStudents={loadStudentsForFilter}
        current={filters}
        onApply={(f) => {
          setFilters(f);
          setPage(1);
        }}
        onClear={() => {
          setFilters({ status: "all", order: "desc" });
          setPage(1);
        }}
      />

      <CreateReportModal
        isOpen={isReportOpen}
        onClose={() => {
          onReportClose();
          setReportMeetingId(null);
          setReportStudentId(null);
          setFilters((prev) => ({ ...prev, studentId: undefined }));
          const params = new URLSearchParams(searchParams.toString());
          params.delete("createReportFor");
          params.delete("studentId");
          router.replace(`/reuniones?${params.toString()}`, { scroll: false });
        }}
        meetingId={reportMeetingId}
        studentId={reportStudentId}
        onCreated={() => {
          onReportClose();
          setReportMeetingId(null);
          setReportStudentId(null);
          setFilters((prev) => ({ ...prev, studentId: undefined }));
          const params = new URLSearchParams(searchParams.toString());
          params.delete("createReportFor");
          params.delete("studentId");
          router.replace(`/reuniones?${params.toString()}`, { scroll: false });
          loadMeetings(page);
        }}
      />

      <ViewReportModal
        isOpen={isViewOpen}
        onClose={() => {
          onViewClose();
          setViewMeetingId(null);
          setViewStudentId(null);
          const params = new URLSearchParams(searchParams.toString());
          params.delete("viewReportFor");
          router.replace(`/reuniones?${params.toString()}`, { scroll: false });
        }}
        meetingId={viewMeetingId}
        studentId={viewStudentId}
        onDeleted={() => loadMeetings(page)}
        onOpenSubjects={async ({ studentId, careerId, careerName }) => {
          await subjectsModal.openSubjects({ studentId, careerId, careerName });
          onSubjectsOpen();
        }}
      />

      <SubjectModal
        isOpen={isSubjectsOpen}
        onClose={() => {
          onSubjectsClose();
          subjectsModal.closeSubjects();
        }}
        onConfirm={async () => {
          await subjectsModal.saveSubjects();
          onSubjectsClose();
        }}
        entityName="Materias"
        titleCareer={subjectsModal.subjectsTitle}
        subjects={subjectsModal.subjects}
        renderSubjectNow={renderSubjectNow}
        state={null}
        role={3}
        showButtonCancelSave={!subjectsModal.savingSubjects}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setRowToDelete(null);
        }}
        onConfirm={confirmDelete}
        isLoading={deleting}
        leastDestructiveRef={cancelDeleteRef}
        title="Eliminar reunión"
        body={
          <>
            ¿Eliminar la reunión con <b>{rowToDelete?.alumno ?? "—"}</b> del{" "}
            <b>
              {rowToDelete?.fecha ?? "—"} {rowToDelete?.hora ?? ""}
            </b>
            ? Esta acción no se puede deshacer.
          </>
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmColorScheme="red"
      />

      {selectedStudent && (
        <StudentModal
          isOpen={isStudentOpen}
          onClose={() => {
            onStudentClose();
            setSelectedStudent(null);
          }}
          isViewMode={true}
          role={normalizedRole}
          formData={selectedStudent}
          countries={countries}
          renderSubjectNowView={(student, i) => (
            <Tr key={student.subjectId ?? i}>
              <Td>{student.subjectName}</Td>
              <Td>{student.year}</Td>
              <Td>{student.subjectState}</Td>
              <Td>
                {student.updateAt
                  ? new Date(student.updateAt).toLocaleDateString("es-AR")
                  : "-"}
              </Td>
            </Tr>
          )}
        />
      )}
    </>
  );
};

export default Reuniones;
