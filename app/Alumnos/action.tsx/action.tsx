import axios from "axios";

const API_URL = "http://localhost:3000/students";

export interface Student {
  telephone: string;
  id: number;

  user: {
    email: string;
    name: string;
    lastName: string;
  };
  career: { name: string };
}

export const StudentService = {
  async fetchAllStudents(): Promise<Student[]> {
    try {
      const response = await axios.get<Student[]>(API_URL);
      const students = response.data; // `axios` automáticamente maneja la conversión a JSON
      console.log(students);
      return students;
    } catch (error) {
      console.error("Failed to fetch students:", error);
      throw new Error("Failed to fetch students");
    }
  },
};
