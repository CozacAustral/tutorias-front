import { Career } from "../app/interfaces/career.interface";
import { CareerStudent } from "../app/interfaces/careerStudent.interface";
import { Country } from "../app/interfaces/country.interface";
import { AssignedCareer } from "../app/interfaces/create-career.interface";
import { CreateStudent } from "../app/interfaces/CreateStudent";
import { Department } from "../app/interfaces/departments.interface";
import { QueryParamsDto } from "../app/interfaces/query-params-dto";
import { ResponseCreateCareer } from "../app/interfaces/response-create-career.interface";
import { ResponsePaginateStudent } from "../app/interfaces/response-paginate";
import { ResponseUpdateSubject } from "../app/interfaces/response-update-subject.interface";
import { Student } from "../app/interfaces/student.interface";
import { SubjectCareerWithState } from "../app/interfaces/subject-career-student.interface";
import { TutorPatchMe } from "../app/interfaces/tutor-patch-me.interface";
import { UpdateStudentDto } from "../app/interfaces/update-student";
import { UpdateStudentModalDto } from "../app/interfaces/update-student-modal.interface";
import { User } from "../app/interfaces/user.interface";
import axiosInstance from "../axiosConfig";
import { ResponseTutor } from "../app/interfaces/response-tutor.interface";
import { Tutors } from "../app/interfaces/create.tutors.interface";

const urlUsers = "users";
const urlTutors = "tutors";
const urlStudents = "students";
const urlCareers = "careers";
const urlCountries = "countries";
const urlDepartments = "departments";

export const UserService = {
  async fetchAllDepartments(): Promise<Department[]> {
    try {
      const response = await axiosInstance.get<Department[]>(
        `${urlDepartments}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Error al obtener los departamentos: ${error.message || error}`
      );
    }
  },

  async fetchAllCareers(): Promise<Career[]> {
    try {
      const response = await axiosInstance.get<Career[]>(
        `${urlCareers}/carreras`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Error al obtener las carreras: ${error.message || error}`
      );
    }
  },

  async fetchCareers(careerId: number): Promise<Career> {
    try {
      const response = await axiosInstance.get<Career>(
        `${urlCareers}/${careerId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al obtener la carrera: ${error.message || error}`);
    }
  },

  async fetchAllCountries(): Promise<Country[]> {
    try {
      const response = await axiosInstance.get<Country[]>(
        `${urlCountries}/paises`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Error al obtener los paises de los estudiantes: ${
          error.message || error
        }`
      );
    }
  },

  async fetchStudentById(id: number): Promise<Student> {
    try {
      const response = await axiosInstance.get<Student>(`${urlStudents}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        `No se pudo obtener el estudiante con ID ${id}. ${
          error.message || error
        }`
      );
    }
  },

  async fetchAllUsers(): Promise<User[]> {
    try {
      const response = await axiosInstance.get<User[]>(urlUsers);
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Error al obtener los usuarios: ${error.message || error}`
      );
    }
  },

  async fetchStudentSubject(
    studentId: number,
    careerId: number
  ): Promise<SubjectCareerWithState[]> {
    try {
      const response = await axiosInstance.get<SubjectCareerWithState[]>(
        `${urlStudents}/subjects/${studentId}/${careerId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Error al obtener las materias de la carrera: ${error.message || error}`
      );
    }
  },

  async createStudent(studentData: CreateStudent): Promise<CreateStudent> {
    try {
      const response = await axiosInstance.post(urlStudents, studentData);
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Error al crear el estudiante: ${error.message || error}`
      );
    }
  },

  async createCareer(
    careerData: AssignedCareer
  ): Promise<ResponseCreateCareer> {
    try {
      const response = await axiosInstance.post(urlCareers, {
        careerId: careerData.careerId,
        studentId: careerData.studentId,
        yearOfAdmission: careerData.yearOfAdmission,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al crear la carrera: ${error.message || error}`);
    }
  },

  async importStudent(file: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axiosInstance.post(`${urlStudents}/upload-students`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error: any) {
      throw new Error(
        `Error al importar estudiantes: ${error.message || error}`
      );
    }
  },

  async tutorPatchMe(id_tutor: number, updatedTutor: TutorPatchMe): Promise<void> {
    try {
      await axiosInstance.patch(`${urlTutors}/${id_tutor}`, 
        {
          "user": {
            "name" : updatedTutor.name,
            "lastName" : updatedTutor.lastName,
            "telephone" : updatedTutor.telephone
          },
          "departmentId" : updatedTutor.departmentId
        }
      );
    } catch (error: any) {
      throw new Error(
        `No se pudo actualizar el tutor. ${error.message || error}`
      );
    }
  },

  async deleteTutor(tutorId: number): Promise<void> {
    try {
      await axiosInstance.delete(`${urlTutors}/${tutorId}`);
    } catch (error: any) {
      throw new Error(
        `No se pudo eliminar al tutor con ID ${tutorId}. ${
          error.message || error
        }`
      );
    }
  },

  async deleteUser(id: number, password: string): Promise<void> {
    try {
      await axiosInstance.delete(`${urlUsers}/${id}`,
        {
          data: { password }
        }
      );
    } catch (error: any) {
      throw new Error(
        `No se pudo eliminar al tutor con ID ${id}. ${
          error.message || error
        }`
      );
    }
  },

  async fetchAllTutors(): Promise<Tutors[]> {
    try {
      const response = await axiosInstance.get<Tutors[]>(urlTutors);
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Error al obtener los tutores: ${error.message || error}`
      );
    }
  },

  async fetchAllStudents(
    params?: QueryParamsDto
  ): Promise<ResponsePaginateStudent> {
    try {
      const response = await axiosInstance.get<{
        students: Student[];
        totalCount: number;
      }>(urlStudents, {
        params: params,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Error al obtener los estudiantes: ${error.message || error}`
      );
    }
  },

  async fetchStudent(studentId: number): Promise<Student> {
    try {
      const response = await axiosInstance.get<Student>(
        `${urlStudents}/${studentId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Error al obtener el estudiante: ${error.message || error}`
      );
    }
  },

  async changePassword(currentPassword: string, newPassword: string) {
    try{
      const response = await axiosInstance.patch(`${urlUsers}/change-password`, 
        {
          "currentPassword" : currentPassword,
          "newPassword" : newPassword
        }
      )
      return response.data
    } catch (error) {
      throw new Error(`No se pudo actualizar la contraseña. ${ error }`)
    } 
  },

  async updateStudent(
    studentId: number,
    updatedData: UpdateStudentDto
  ): Promise<void> {
    try {
      const response = await axiosInstance.patch(
        `${urlStudents}/${studentId}`,
        updatedData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `No se pudo actualizar el estudiante con ID ${studentId}. ${
          error.message || error
        }`
      );
    }
  },

  async deleteStudent(studentId: number): Promise<void> {
    try {
      await axiosInstance.delete(`${urlStudents}/${studentId}`);
    } catch (error: any) {
      throw new Error(
        `No se pudo eliminar al estudiante con ID ${studentId}. ${
          error.message || error
        }`
      );
    }
  },

  async updateTutor(tutorId: number, updateData: any): Promise<void> {
    try {
      await axiosInstance.patch(`${urlTutors}/${tutorId}`, updateData);
    } catch (error: any) {
      throw new Error(
        `No se pudo actualizar el tutor con ID ${tutorId}. ${
          error.message || error
        }`
      );
    }
  },

  async updateStateSubject(
    studentId: number,
    subjectId: number,
    state: string
  ): Promise<void> {
    try {
      const response = await axiosInstance.patch(
        `${urlStudents}/changeSubjectState/${studentId}`,
        {
          subjectId: subjectId,
          newState: state,
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `No se pudo actualizar el estado de la materia del alumno con ID ${studentId}. ${
          error.message || error
        }`
      );
    }
  },

  async updateStudentModal(
    studentId: number,
    lastName: string,
    name: string,
    email: string,
    telephone: string,
    observations: string
  ): Promise<UpdateStudentDto> {
    try {
      const response = await axiosInstance.patch(
        `${urlStudents}/updateStudentModal/${studentId}`,
        {
          lastName,
          name,
          email,
          telephone,
          observations,
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `No se pudo actualizar el alumno con ID ${studentId}. ${
          error.message || error
        }`
      );
    }
  },
};
