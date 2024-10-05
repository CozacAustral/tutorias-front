import axios from "axios";
import { Toast } from "@chakra-ui/react"; // Importa toast desde Chakra UI
import axiosInstance from "../axiosConfig";

const url = "users";
const url_tutors = "tutors";

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  lastName: string;
  roleId: string;
  departmentId: number;
}

export const UserService = {
  async fetchAllAdmins(): Promise<User[]> {
    try {
      const response = await axiosInstance.get<User[]>(`${url}/admins`);
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

  async createAdmin(adminData: {
    email: string;
    name: string;
    lastName: string;
    roleId: number;
    departmentId: number;
  }): Promise<void> {
    try {
      await axiosInstance.post(url, adminData);
    } catch (error) {
      console.error("Error al crear el administrador:", error);
      throw new Error("Failed to create admin");
    }
  },
  async updateAdmin(userId: number, updateData: Partial<User>): Promise<void> {
    try {
      await axiosInstance.patch(`${url}/${userId}`, updateData);
      Toast({
        title: "Success",
        description: `Tutor with ID ${userId} updated successfully`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      Toast({
        title: "Error",
        description: `Failed to delete user with ID ${userId}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      throw new Error(`Failed to delete user with ID ${userId}`);
    }
  },

  async deleteTutor(TutorId: number): Promise<void> {
    try {
      await axiosInstance.delete(`${url_tutors}/${TutorId}`);
      Toast({
        title: "Success",
        description: `User with ID ${TutorId} deleted successfully`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      Toast({
        title: "Error",
        description: `Failed to delete user with ID ${TutorId}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      throw new Error(`Failed to delete user with ID ${TutorId}`);
    }
  },

  async updateTutor(tutorId: number, updateData: Partial<User>): Promise<void> {
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
      Toast({
        title: "Error",
        description: `Failed to update tutor with ID ${tutorId}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      throw new Error(`Failed to update tutor with ID ${tutorId}`);
    }
  },
};
