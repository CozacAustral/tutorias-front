import axiosInstance from "../../axiosConfig";

interface LoginResponse {
  accessToken: string;
}

export const createPassword = async (
  token: string,
  password: string
): Promise<LoginResponse> => {
  console.log('🚀 Token que se manda al back:', token);
  try {
    const response = await axiosInstance.post('auth/set-password', {
      password
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error) {
    console.log(token)
    console.error("Error en la autenticación:");
    throw error;
  }
};