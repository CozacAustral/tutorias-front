export interface Document {
  id: string;
  name: string;
  description?: string | null;
  type?: string | null;
  url: string;
  createdAt: string;
  updatedAt?: string | null;
  authorId?: number | null;
}
