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
  role: number;
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

  async deleteTutor(TutorId: number): Promise<void> {
    try {
      await axios.delete(`${url_tutors}/${TutorId}`);
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
      await axios.patch(`${url_tutors}/${tutorId}`, updateData);
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
