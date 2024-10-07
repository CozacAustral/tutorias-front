import axios from "axios";
import { Toast } from "@chakra-ui/react";
import axiosInstance from "../axiosConfig";

const url = "users";
const url_tutors = "tutors";
const url_students = "students";

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  lastName: string;
  role: number;
}

export interface Student {
  id: number;
  dni: string;
  telephone: string;
  birthdate: Date;
  address: string;
  yearEntry: Date;
  observations?: string;
  countryId: number;
  user: User;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
export interface Tutors {
  id: number;
  dni: string;
  birthdate: Date;
  sex: string;
  yearEntry: Date;
  category: string;
  dedication: string;
  dedicationDays: number;
  user: User;
  userId: number;
  countryId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}


 export interface UpdateStudentDto  { 
  name?: string
}

export const UserService = {
  async fetchAllUsers(): Promise<User[]> {
    try {
      const response = await axiosInstance.get<User[]>(url);
      return response.data;
    } catch (error) {
      Toast({
        title: "Error",
        description: "Failed to fetch users.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      throw new Error("Failed to fetch users");
    }
  },

  async fetchAllTutors(): Promise<Tutors[]> {
    try {
      const response = await axiosInstance.get<Tutors[]>(url_tutors);
      return response.data;
    } catch (error) {
      Toast({
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
      Toast({
        title: "Error",
        description: "Failed to fetch students.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      throw new Error("Failed to fetch students");
    }
  },  

  async deleteTutor(tutorId: number): Promise<void> {
    try {
      await axiosInstance.delete(`${url_tutors}/${tutorId}`);
      Toast({
        title: "Success",
        description: `User with ID ${tutorId} deleted successfully`,
        status: "success",
        duration: 5000,
        isClosable: true,
      }); 
    } catch (error) {
      Toast({
        title: "Error",
        description: `Failed to delete user with ID ${tutorId}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      }); 
      throw new Error(`Failed to delete user with ID ${tutorId}`);
    }
  },



  async deleteStudent(studentId: number): Promise<void> {
    try {
      await axiosInstance.delete(`${url_students}/${studentId}`);
      Toast({
        title: "Success",
        description: `User with ID ${studentId} deleted successfully`,
        status: "success",
        duration: 5000,
        isClosable: true,
      }); 
    } catch (error) {
      Toast({
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
      Toast({
        title: "Éxito",
        description: `Estudiante con ID ${studentId} actualizado correctamente.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      return response.data; 
    } catch (error) {
      Toast({
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
      Toast({
        title: "Success",
        description: `Tutor with ID ${tutorId} updated successfully`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error al actualizar el tutor:', error);
      Toast({
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
