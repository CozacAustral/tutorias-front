import axiosInstance from "../../axiosConfig";

interface LoginResponse {
  accessToken: string;
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error en la autenticación:");
    throw error;
  }
};

export const sendRecoveryEmail = async (email: string) => {
  await axiosInstance.post("/auth/recover-password", { email });
};