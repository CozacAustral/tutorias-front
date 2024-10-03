import axios from "axios";
import { Toast } from "@chakra-ui/react"; // Importa toast desde Chakra UI

const API_URL = "http://localhost:3000/users";
const API_URL_TUTORS = "http://localhost:3000/tutors";

function getToken() {
  return getCookie('authTokens');  
}

function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

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
      const token = getToken();
      const response = await axios.get<User[]>(API_URL, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
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
      const token = getToken();
      await axios.delete(`${API_URL}/${TutorId}`, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
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
      const token = getToken(); 
      await axios.patch(`${API_URL_TUTORS}/${tutorId}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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
