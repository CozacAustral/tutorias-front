import axios from "axios";

const API_URL = "http://localhost:3000/users";

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
      const users = response.data; // `axios` automáticamente maneja la conversión a JSON
      console.log(users);
      return users;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw new Error("Failed to fetch users");
    }
  },
};
