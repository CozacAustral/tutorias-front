import { CreateStudent } from "../app/interfaces/CreateStudent";
import { CreateUser } from "../app/interfaces/createUser";
import { Student } from "../app/interfaces/student.interface";
import { Tutors } from "../app/interfaces/create.tutors.interface";
import { User } from "../app/interfaces/user.interface";
import axiosInstance from "../axiosConfig";
import { ResponseTutor } from "../app/interfaces/response-tutor.interface";

const url = "users";
const url_tutors = "tutors";
const url_students = "students";

export const UserService = {
async getStudentsWithoutTutor(
  page = 1,
  limit = 7,
  search?: string
): Promise<{
  data: Student[];
  total: number;
  page: number;
  limit: number;
}> {
  const params = new URLSearchParams();
  params.append("currentPage", page.toString());
  params.append("resultsPerPage", limit.toString());
  if (search) params.append("search", search);

  const res = await axiosInstance.get(`/students/without-tutor?${params}`);
  return res.data;
},

  async assignStudentsToTutor(dto: { tutorId: number; studentsIds: number[] }) {
    await axiosInstance.post("/users/create-assignment", dto);
  },

  async getStudentsByTutor(
    tutorId: number,
    query: {
      search?: string;
      currentPage?: number;
      resultsPerPage?: number;
    }
  ): Promise<{
    data: Student[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await axiosInstance.get(
      `/tutors/get-students/${tutorId}`,
      {
        params: query,
      }
    );
    return response.data;
  },

  async deleteAssignment(dto: { tutorId: number; studentId: number }) {
    return axiosInstance.delete("/users/delete-assignment", {
      data: dto,
    });
  },

  async createTutor(tutorData: any): Promise<void> {
    try {
      await axiosInstance.post(url_tutors, tutorData);
    } catch (error: any) {
      throw new Error(`Error al crear el tutor: ${error.message || error}`);
    }
  },
  async deleteUser(id: number | string): Promise<void> {
    try {
      await axiosInstance.delete(`/users/${id}`);
    } catch (error: any) {
      throw new Error(
        `No se pudo eliminar el usuario con ID ${id}. ${error.message || error}`
      );
    }
  },

  async updateUser(
    id: number,
    updatedData: {
      name?: string;
      lastName?: string;
      telephone?: string;
      password?: string;
    }
  ): Promise<void> {
    try {
      await axiosInstance.patch(`users/${id}`, updatedData);
    } catch (error: any) {
      throw new Error(
        `No se pudo actualizar el usuario. ${error.message || error}`
      );
    }
  },

  async createUser(newUser: CreateUser) {
    const res = await axiosInstance.post("/users", newUser);
    return res.data;
  },

  async fetchAdminUsers(page: number, limit: number) {
    try {
      const response = await axiosInstance.get(`/users/admins`, {
        params: {
          currentPage: page,
          resultsPerPage: limit,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Error al obtener administradores. ${error.message || error}`
      );
    }
  },

  async fetchUserById(id: number): Promise<User> {
    try {
      const response = await axiosInstance.get<User>(`/users/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        `No se pudo obtener el usuario con ID ${id}. ${error.message || error}`
      );
    }
  },

  async fetchStudentById(id: number): Promise<Student> {
    try {
      const response = await axiosInstance.get<Student>(
        `${url_students}/${id}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `No se pudo obtener el estudiante con ID ${id}. ${
          error.message || error
        }`
      );
    }
  },

  async fetchAllUsers(): Promise<User[]> {
    try {
      const response = await axiosInstance.get<User[]>(url);
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Error al obtener los usuarios: ${error.message || error}`
      );
    }
  },

  async createStudent(studentData: CreateStudent): Promise<CreateStudent> {
    try {
      const response = await axiosInstance.post(url_students, studentData);
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Error al crear el estudiante: ${error.message || error}`
      );
    }
  },

  async importStudent(file: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axiosInstance.post(`${url_students}/upload-students`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error: any) {
      throw new Error(
        `Error al importar estudiantes: ${error.message || error}`
      );
    }
  },

  async deleteTutor(tutorId: number): Promise<void> {
    try {
      await axiosInstance.delete(`${url_tutors}/${tutorId}`);
    } catch (error: any) {
      throw new Error(
        `No se pudo eliminar al tutor con ID ${tutorId}. ${
          error.message || error
        }`
      );
    }
  },

  async fetchAllTutors(query: {
    search?: string;
    departmentName?: string;
    orderBy?: [string, "asc" | "desc"];
    currentPage?: number;
    resultsPerPage?: number;
  }): Promise<{
    data: ResponseTutor[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await axiosInstance.get("/tutors", {
      params: query,
    });
    return response.data;
  },

  async fetchAllStudents(): Promise<Student[]> {
    try {
      const response = await axiosInstance.get<Student[]>(url_students);
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Error al obtener los estudiantes: ${error.message || error}`
      );
    }
  },

  async deleteStudent(studentId: number): Promise<void> {
    try {
      await axiosInstance.delete(`${url_students}/${studentId}`);
    } catch (error: any) {
      throw new Error(
        `No se pudo eliminar al estudiante con ID ${studentId}. ${
          error.message || error
        }`
      );
    }
  },

  async updateStudent(studentId: number, updatedData: any): Promise<void> {
    try {
      const response = await axiosInstance.patch(
        `${url_students}/${studentId}`,
        updatedData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `No se pudo actualizar el estudiante con ID ${studentId}. ${
          error.message || error
        }`
      );
    }
  },

  async updateTutor(tutorId: number, updateData: any): Promise<void> {
    try {
      await axiosInstance.patch(`${url_tutors}/${tutorId}`, updateData);
    } catch (error: any) {
      throw new Error(
        `No se pudo actualizar el tutor con ID ${tutorId}. ${
          error.message || error
        }`
      );
    }
  },
};
