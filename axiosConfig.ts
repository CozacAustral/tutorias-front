import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { toastError } from "./common/feedback/toast-standalone";

function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

function getToken() {
  return getCookie("authTokens");
}

declare module "axios" {
  export interface AxiosRequestConfig {
    meta?: {
      successMessage?: string;
      errorMessage?: string;
      silent?: boolean;
    };
  }
}

function extractErrorMessage(error: unknown): string {
  const err = error as AxiosError<any>;
  if (err?.response?.data) {
    const data = err.response.data;

    if (typeof data === "string") return data;

    if (data?.title && data?.detail) return `${data.title}: ${data.detail}`;
    if (data?.message) return data.message;
    if (data?.error) return data.error;

    if (Array.isArray(data?.errors)) {
      return data.errors.map((e: any) => e?.message ?? e).join(", ");
    }
    if (data?.errors && typeof data.errors === "object") {
      const firstKey = Object.keys(data.errors)[0];
      if (firstKey && Array.isArray(data.errors[firstKey])) {
        return data.errors[firstKey][0];
      }
    }
  }

  if (err?.message) return err.message;
  return "Ocurrió un error inesperado. Intenta nuevamente.";
}

function shouldAutoSuccessToast(config?: AxiosRequestConfig) {
  const method = (config?.method ?? "get").toLowerCase();
  return method !== "get";
}

function defaultSuccessMessage(method?: string) {
  switch ((method ?? "get").toLowerCase()) {
    case "post":
      return "Creado correctamente";
    case "put":
    case "patch":
      return "Actualizado correctamente";
    case "delete":
      return "Eliminado correctamente";
    default:
      return "Operación realizada";
  }
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { config } = response;
    return response;
  },
  (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig | undefined;

    if (!config?.meta?.silent) {
      const fallback = config?.meta?.errorMessage;
      const message = fallback ?? extractErrorMessage(error);
      toastError({ title: "Error", description: message });
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
