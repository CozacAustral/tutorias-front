import axiosInstance from "../../../axiosConfig";

interface LoginResponse {
  accessToken: string;
}

export const createPassword = async (
  token: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post("/auth/set-password", {
      token,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error en la autenticación:");
    throw error;
  }
};