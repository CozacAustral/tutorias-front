import axios from "axios";
import { useToast } from "@chakra-ui/react";
import axiosInstance from "../axiosConfig";
import { User } from "../app/interfaces/user.interface";
import { Tutors } from "../app/interfaces/tutors.interface";
import { Student } from "../app/interfaces/student.interface";
import { CreateStudent } from "../app/interfaces/CreateStudent";

const url = "users";
const url_tutors = "tutors";
const url_students = "students";

const toast = useToast();

export const UserService = {


  async fetchStudentById(id: number): Promise<Student> {
    try {
      const response = await axiosInstance.get<Student>(`${url_students}/${id}`);
      return response.data
    }catch(error) {
      Toast({
        title: "Error",
        description: `No se pudo obtener el estudiante con ID ${id}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    console.error("Error al obtener a el estudiante: " )
    throw new Error(`No se pudo obtener el estudiante con ID ${id}`);
  },
  
  async fetchAllUsers(): Promise<User[]> {
    try {
      const response = await axiosInstance.get<User[]>(url);
      return response.data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      throw new Error("Failed to fetch users");
    }
  },

  async createStudent(studentData: CreateStudent): Promise<CreateStudent> {
    try {
      const response = await axiosInstance.post(url_students, studentData);
      toast({
        title: "Éxito",
        description: "Estudiante creado correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      return response.data; 
    } catch (error) {
      console.error("Error al crear el estudiante:", error);
      toast({
        title: "Error",
        description: "Falló la creación del estudiante.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      throw new Error("Error al crear el estudiante");
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
      toast({
        title: "Éxito",
        description: "Alumnos importados correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al importar alumnos:", error);
      toast({
        title: "Error",
        description: "Falló la importación de alumnos.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      throw new Error("Error al importar alumnos");
    }
  },

  async deleteTutor(tutorId: number): Promise<void> {
    try {
      await axiosInstance.delete(`${url_tutors}/${tutorId}`);
      toast({
        title: "Success",
        description: `User with ID ${tutorId} deleted successfully`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete user with ID ${tutorId}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      throw new Error(`Failed to delete user with ID ${tutorId}`);
    }
  },

  async fetchAllTutors(): Promise<Tutors[]> {
    try {
      const response = await axiosInstance.get<Tutors[]>(url_tutors);
      return response.data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tutores.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      throw new Error("Failed to fetch tutores");
    }
  },

  async fetchAllStudents(): Promise<Student[]> {
    try {
      const response = await axiosInstance.get<Student[]>(url_students);
      return response.data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch students.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      throw new Error("Failed to fetch students");
    }
  },

  async deleteStudent(studentId: number): Promise<void> {
    try {
      await axiosInstance.delete(`${url_students}/${studentId}`);
      toast({
        title: "Success",
        description: `User with ID ${studentId} deleted successfully`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete user with ID ${studentId}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      throw new Error(`Failed to delete user with ID ${studentId}`);
    }
  },

  async updateStudent(studentId: number, updatedData: any): Promise<void> {
    try {
      const response = await axiosInstance.patch(`${url_students}/${studentId}`, updatedData);
      toast({
        title: "Éxito",
        description: `Estudiante con ID ${studentId} actualizado correctamente.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      return response.data; 
    } catch (error) {
      toast({
        title: "Error",
        description: `Error al actualizar estudiante con ID ${studentId}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error al actualizar el estudiante:", error);
      throw error; 
    }
  },

  async updateTutor(tutorId: number, updateData: any): Promise<void> {
    try {
      await axiosInstance.patch(`${url_tutors}/${tutorId}`, updateData);
      toast({
        title: "Success",
        description: `Tutor with ID ${tutorId} updated successfully`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error al actualizar el tutor:', error);
      toast({
        title: "Error",
        description: `Failed to update tutor with ID ${tutorId}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      throw new Error(`Failed to update tutor with ID ${tutorId}`);
    }
  }
};
