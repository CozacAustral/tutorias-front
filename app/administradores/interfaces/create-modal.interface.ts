import { Field } from "../type/field.type";

export interface GenericCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSuccess: () => void;
  title: string;
  fields: Field[];
  createFn: (data: any) => Promise<void>;
  defaultValues?: Record<string, any>;
}