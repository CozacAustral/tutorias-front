import axios from "axios";
import axiosInstance from "../axiosConfig";
import { User } from "../app/interfaces/user.interface";
import { Tutors } from "../app/interfaces/tutors.interface";
import { Student } from "../app/interfaces/student.interface";
import { CreateStudent } from "../app/interfaces/CreateStudent";

const url = "users";
const url_tutors = "tutors";
const url_students = "students";

export const UserService = {


  async fetchStudentById(id: number): Promise<Student> {
    try {
      const response = await axiosInstance.get<Student>(`${url_students}/${id}`);
      return response.data
    }catch(error) {
      console.error(`Error to find student with ID ${id}:`, error);
    }
    console.error("Error al obtener a el estudiante: " )
    throw new Error(`No se pudo obtener el estudiante con ID ${id}`);
  },
  
  async fetchAllUsers(): Promise<User[]> {
    try {
      const response = await axiosInstance.get<User[]>(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  },

  async createStudent(studentData: CreateStudent): Promise<CreateStudent> {
    try {
      const response = await axiosInstance.post(url_students, studentData);
      return response.data; 
    } catch (error) {
      console.error("Error creating student:", error);
      throw new Error("Error creating student");
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
    } catch (error) {
      console.error("Error importing students:", error);
      throw new Error("Error importing students");
    }
  },

  async deleteTutor(tutorId: number): Promise<void> {
    try {
      await axiosInstance.delete(`${url_tutors}/${tutorId}`);
    } catch (error) {
      console.error(`Error deleting tutor with ID ${tutorId}:`, error);
      throw new Error(`Failed to delete tutor with ID ${tutorId}`);
    }
  },

  async fetchAllTutors(): Promise<Tutors[]> {
    try {
      const response = await axiosInstance.get<Tutors[]>(url_tutors);
      return response.data;
    } catch (error) {
      console.error("Error fetching tutors:", error);
      throw new Error("Failed to fetch tutors");
    }
  },

  async fetchAllStudents(): Promise<Student[]> {
    try {
      const response = await axiosInstance.get<Student[]>(url_students);
      return response.data;
    } catch (error) {
      console.error("Error fetching students:", error);
      throw new Error("Failed to fetch students");
    }
  },

  async deleteStudent(studentId: number): Promise<void> {
    try {
      await axiosInstance.delete(`${url_students}/${studentId}`);
    } catch (error) {
      console.error(`Error deleting student with ID ${studentId}:`, error);
      throw new Error(`Failed to delete student with ID ${studentId}`);
    }
  },

  async updateStudent(studentId: number, updatedData: any): Promise<void> {
    try {
      const response = await axiosInstance.patch(`${url_students}/${studentId}`, updatedData);
      return response.data; 
    } catch (error) {
      console.error(`Error updating student with ID ${studentId}:`, error);
      throw error; 
    }
  },

  async updateTutor(tutorId: number, updateData: any): Promise<void> {
    try {
      await axiosInstance.patch(`${url_tutors}/${tutorId}`, updateData);
    } catch (error) {
      console.error(`Error updating tutor with ID ${tutorId}:`, error);
      throw new Error(`Failed to update tutor with ID ${tutorId}`);
    }
  }
};
