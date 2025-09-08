import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { toastError, toastSuccess } from "./common/feedback/toastStandalone";


// ---- Helpers ----
function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

function getToken() {
  return getCookie("authTokens");
}

// Extensión de config para metadatos del toast
declare module "axios" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface AxiosRequestConfig {
    meta?: {
      successMessage?: string; // mensaje de éxito opcional
      errorMessage?: string;   // mensaje de error opcional (fallback)
      silent?: boolean;        // true => no mostrar toasts automáticos
    };
  }
}

// Extraer mensaje de error del backend (ajustable a tu formato)
function extractErrorMessage(error: unknown): string {
  const err = error as AxiosError<any>;
  if (err?.response?.data) {
    const data = err.response.data;

    if (typeof data === "string") return data;

    if (data?.title && data?.detail) return `${data.title}: ${data.detail}`;
    if (data?.message) return data.message;
    if (data?.error) return data.error;

    if (Array.isArray(data?.errors)) {
      return data.errors.map((e: any) => (e?.message ?? e)).join(", ");
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

// Determinar si deberíamos mostrar éxito auto (POST/PUT/PATCH/DELETE)
function shouldAutoSuccessToast(config?: AxiosRequestConfig) {
  const method = (config?.method ?? "get").toLowerCase();
  return method !== "get";
}

// Mensaje por defecto según método si no viene meta.successMessage
function defaultSuccessMessage(method?: string) {
  switch ((method ?? "get").toLowerCase()) {
    case "post":   return "Creado correctamente";
    case "put":
    case "patch":  return "Actualizado correctamente";
    case "delete": return "Eliminado correctamente";
    default:       return "Operación realizada";
  }
}

// ---- Axios instance ----
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 10000,
});

// ---- Request interceptor (Auth) ----
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Response interceptor (éxito + error centralizados) ----
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { config } = response;
    if (!config?.meta?.silent && shouldAutoSuccessToast(config)) {
      const msg = config.meta?.successMessage ?? defaultSuccessMessage(config.method);
      // Evitar toasts en llamadas de “lectura” aunque sean DELETE a recursos anidados GETs… ya lo controlamos por método.
      if (msg) toastSuccess({ title: msg });
    }
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
  }
);

export default axiosInstance;
