import axios from "axios";

const API_URL = "http://localhost:3000/users";
const API_URL_TUTORS = "http://localhost:3000/tutors"


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
      const response = await axios.get<User[]>(API_URL);
      const users = response.data;
      return users;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw new Error("Failed to fetch users");
    }
  },
  async deleteTutor(TutorId: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${TutorId}`);
      console.log(`User with ID ${TutorId} deleted successfully`);
    } catch (error) {
      console.error(`Failed to delete user with ID ${TutorId}:`, error);
      throw new Error(`Failed to delete user with ID ${TutorId}`);
    }
  },
  async updateTutor(tutorId: number, updateData: Partial<User>): Promise<void> {
  try {
    await axios.patch(`${API_URL_TUTORS}/${tutorId}`, updateData);
    console.log(`Tutor with ID ${tutorId} updated successfully`);
  } catch (error) {
    console.error(`Failed to update tutor with ID ${tutorId}:`, error);
    throw new Error(`Failed to update tutor with ID ${tutorId}`);
  }
},

}
