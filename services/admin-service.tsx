import { Career } from "../app/interfaces/career.interface";
import { CareerStudent } from "../app/interfaces/careerStudent.interface";
import { Country } from "../app/interfaces/country.interface";
import { CreateCareer } from "../app/interfaces/create-career.interface";
import { CreateStudent } from "../app/interfaces/CreateStudent";
import { ResponseCreateCareer } from "../app/interfaces/response-create-career.interface";
import { ResponseUpdateSubject } from "../app/interfaces/response-update-subject.interface";
import { Student } from "../app/interfaces/student.interface";
import { SubjectCareerWithState } from "../app/interfaces/subject-career-student.interface";
import { Tutors } from "../app/interfaces/tutors.interface";
import { UpdateStudentDto } from "../app/interfaces/update-student";
import { UpdateStudentModalDto } from "../app/interfaces/update-student-modal.interface";
import { User } from "../app/interfaces/user.interface";
import axiosInstance from "../axiosConfig";

const urlUsers = "users";
const urlTutors = "tutors";
const urlStudents = "students";
const urlCareers = 'careers'
const urlCountries = 'countries'

export const UserService = {

  async fetchAllCareers(): Promise<Career[]> {
    try {
      const response = await axiosInstance.get<Career[]>(`${urlCareers}/carreras`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al obtener las carreras: ${error.message || error}`);
    }
  },

   async fetchCareers(careerId: number): Promise<Career> {
    try {
      const response = await axiosInstance.get<Career>(`${urlCareers}/${careerId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al obtener la carrera: ${error.message || error}`);
    }
  },

  async fetchAllCountries(): Promise<Country[]> {
    try {
      const response = await axiosInstance.get<Country[]>(`${urlCountries}/paises`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al obtener los paises de los estudiantes: ${error.message || error}`);
    }
  },

  async fetchStudentById(id: number): Promise<Student> {
    try {
      const response = await axiosInstance.get<Student>(`${urlStudents}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`No se pudo obtener el estudiante con ID ${id}. ${error.message || error}`);
    }
  },

  async fetchAllUsers(): Promise<User[]> {
    try {
      const response = await axiosInstance.get<User[]>(urlUsers);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al obtener los usuarios: ${error.message || error}`);
    }
  },

  async fetchStudentSubject(studentId: number, careerId: number): Promise<SubjectCareerWithState[]>{
     try {
      const response = await axiosInstance.get<SubjectCareerWithState[]>(`${urlStudents}/subjects/${studentId}/${careerId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al obtener las materias de la carrera: ${error.message || error}`);
    }
  },

  async createStudent(studentData: CreateStudent): Promise<CreateStudent> {
    try {
      const response = await axiosInstance.post(urlStudents, studentData);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al crear el estudiante: ${error.message || error}`);
    }
  },

  async createCareer(careerData: CreateCareer): Promise<ResponseCreateCareer> {
    console.log('CARRERA MANDADA AL BACK: ', careerData)
    try {
      const response = await axiosInstance.post(urlCareers,
        {
          'name': careerData.name,
          'yearOfThePlan': careerData.yearOfThePlan,
          'studentId': careerData.studentId
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
          'Content-Type': 'multipart/form-data',
        }
      });
    } catch (error: any) {
      throw new Error(`Error al importar estudiantes: ${error.message || error}`);
    }
  },

  async deleteTutor(tutorId: number): Promise<void> {
    try {
      await axiosInstance.delete(`${urlTutors}/${tutorId}`);
    } catch (error: any) {
      throw new Error(`No se pudo eliminar al tutor con ID ${tutorId}. ${error.message || error}`);
    }
  },

  async fetchAllTutors(): Promise<Tutors[]> {
    try {
      const response = await axiosInstance.get<Tutors[]>(urlTutors);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al obtener los tutores: ${error.message || error}`);
    }
  },

  async fetchAllStudents(): Promise<Student[]> {
    try {
      const response = await axiosInstance.get<Student[]>(urlStudents);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al obtener los estudiantes: ${error.message || error}`);
    }
  },

  async fetchStudent(studentId: number): Promise<Student> {
    try {
      const response = await axiosInstance.get<Student>(`${urlStudents}/${studentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al obtener el estudiante: ${error.message || error}`);
    }
  },

  async updateStudent(studentId: number, updatedData: UpdateStudentDto): Promise<void> {
    try {
      const response = await axiosInstance.patch(`${urlStudents}/${studentId}`, updatedData);
      return response.data;
    } catch (error: any) {
      throw new Error(`No se pudo actualizar el estudiante con ID ${studentId}. ${error.message || error}`);
    }
  },

  async deleteStudent(studentId: number): Promise<void> {
    try {
      await axiosInstance.delete(`${urlStudents}/${studentId}`);
    } catch (error: any) {
      throw new Error(`No se pudo eliminar al estudiante con ID ${studentId}. ${error.message || error}`);
    }
  },

  async updateTutor(tutorId: number, updateData: any): Promise<void> {
    try {
      await axiosInstance.patch(`${urlTutors}/${tutorId}`, updateData);
    } catch (error: any) {
      throw new Error(`No se pudo actualizar el tutor con ID ${tutorId}. ${error.message || error}`);
    }
  },

  async updateStateSubject(studentId: number, subjectId: number, state: string): Promise<void> {
    try {
      const response = await axiosInstance.patch(`${urlStudents}/changeSubjectState/${studentId}`,
        {
          'subjectId': subjectId,
          'newState': state
        }
      );
      return response.data
    } catch (error: any) {
      throw new Error(`No se pudo actualizar el estado de la materia del alumno con ID ${studentId}. ${error.message || error}`);
    }
  },

  async updateStudentModal(studentId: number, lastName: string, name: string, email: string, telephone: string, observations: string): Promise<UpdateStudentDto> {
    try {
      const response = await axiosInstance.patch(`${urlStudents}/updateStudentModal/${studentId}`,
        {
          lastName, name, email, telephone, observations
        }
      );
      return response.data
    } catch (error: any) {
      throw new Error(`No se pudo actualizar el alumno con ID ${studentId}. ${error.message || error}`);
    }
  }
};
