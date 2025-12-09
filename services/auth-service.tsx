import Cookies from "js-cookie";
import axiosInstance from "../axiosConfig";

const url_auth = "auth";

export const AuthService = {
  async getUserInfo(): Promise<any> {
    try {
      const token = Cookies.get("authTokens");
      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      const response = await axiosInstance.get(`${url_auth}/get-me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error(
        "Error al obtener información del usuario:",
        error.message || error
      );

      // Si el backend devuelve 401, limpiamos cookie y redirigimos al login
      if (error.response?.status === 401) {
        Cookies.remove("authTokens");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Error al obtener información del usuario.",
        status: error.response?.status || 500,
      };
    }
  },
};
