import { Career } from "../app/interfaces/career.interface";
import { Country } from "../app/interfaces/country.interface";
import { CreateStudent } from "../app/interfaces/CreateStudent";
import { Student } from "../app/interfaces/student.interface";
import { Tutors } from "../app/interfaces/tutors.interface";
import { User } from "../app/interfaces/user.interface";
import axiosInstance from "../axiosConfig";

const url = "users";
const url_tutors = "tutors";
const url_students = "students";
const url_careers = 'careers'
const url_countries = 'countries'

export const UserService = {

  async fetchAllCareers(): Promise<Career[]>{
    try {
      const response = await axiosInstance.get<Career[]>(`${url_careers}/carreras`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al obtener las carreras: ${error.message || error}`);
    }
  },

  async fetchAllCountries(): Promise<Country[]>{
    try {
      const response = await axiosInstance.get<Country[]>(`${url_countries}/paises`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al obtener los paises de los estudiantes: ${error.message || error}`);
    }
  },

  async fetchStudentById(id: number): Promise<Student> {
    try {
      const response = await axiosInstance.get<Student>(`${url_students}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`No se pudo obtener el estudiante con ID ${id}. ${error.message || error}`);
    }
  },

  async fetchAllUsers(): Promise<User[]> {
    try {
      const response = await axiosInstance.get<User[]>(url);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al obtener los usuarios: ${error.message || error}`);
    }
  },

  async createStudent(studentData: CreateStudent): Promise<CreateStudent> {
    try {
      const response = await axiosInstance.post(url_students, studentData);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al crear el estudiante: ${error.message || error}`);
    }
  },

  async importStudent(file: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axiosInstance.post(`${url_students}/upload-students`, formData, {
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
      await axiosInstance.delete(`${url_tutors}/${tutorId}`);
    } catch (error: any) {
      throw new Error(`No se pudo eliminar al tutor con ID ${tutorId}. ${error.message || error}`);
    }
  },

  async fetchAllTutors(): Promise<Tutors[]> {
    try {
      const response = await axiosInstance.get<Tutors[]>(url_tutors);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al obtener los tutores: ${error.message || error}`);
    }
  },

  async fetchAllStudents(): Promise<Student[]> {
    try {
      const response = await axiosInstance.get<Student[]>(url_students);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al obtener los estudiantes: ${error.message || error}`);
    }
  },

  async deleteStudent(studentId: number): Promise<void> {
    try {
      await axiosInstance.delete(`${url_students}/${studentId}`);
    } catch (error: any) {
      throw new Error(`No se pudo eliminar al estudiante con ID ${studentId}. ${error.message || error}`);
    }
  },

  async updateStudent(studentId: number, updatedData: any): Promise<void> {
    try {
      const response = await axiosInstance.patch(`${url_students}/${studentId}`, updatedData);
      return response.data;
    } catch (error: any) {
      throw new Error(`No se pudo actualizar el estudiante con ID ${studentId}. ${error.message || error}`);
    }
  },

  async updateTutor(tutorId: number, updateData: any): Promise<void> {
    try {
      await axiosInstance.patch(`${url_tutors}/${tutorId}`, updateData);
    } catch (error: any) {
      throw new Error(`No se pudo actualizar el tutor con ID ${tutorId}. ${error.message || error}`);
    }
  }
};
