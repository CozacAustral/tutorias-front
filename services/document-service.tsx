import { CreateDocumentDto } from "../app/documents/interfaces/create-document.interface";
import { UpdateDocumentDto } from "../app/documents/interfaces/update-document.interface";
import axiosInstance from "../axiosConfig";

export const DocumentService = {
  /**
   * Obtiene documentos paginados y permite filtrar por término de búsqueda.
   * Funciona para nombres, descripciones y URLs completas.
   */
  async getDocuments(page = 1, limit = 10, search?: string) {
    // Definimos los parámetros base para la paginación
    const params: any = {
      currentPage: page,
      resultsPerPage: limit
    };

    /**
     * Si hay un término de búsqueda (sea un nombre o una URL):
     * 1. Usamos trim() para quitar espacios que se cuelan al copiar/pegar.
     * 2. Axios se encargará de codificar los caracteres especiales (?, =, /)
     * para que el backend los reciba correctamente.
     */
    if (search && search.trim() !== "") {
      params.search = search.trim();
    }

    const res = await axiosInstance.get(`/documents`, { params });
    return res.data;
  },

  async getDocumentById(id: string) {
    const res = await axiosInstance.get(`/documents/${id}`);
    return res.data;
  },

  async createDocument(dto: CreateDocumentDto) {
    const res = await axiosInstance.post(`/documents`, dto);
    return res.data;
  },

  async updateDocument(id: string, body: UpdateDocumentDto) {
    const res = await axiosInstance.patch(`/documents/${id}`, body);
    return res.data;
  },

  async deleteDocument(id: string) {
    const res = await axiosInstance.delete(`/documents/${id}`);
    return res.data;
  },
};
