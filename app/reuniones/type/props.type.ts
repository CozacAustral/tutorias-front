import { StudentOption } from './student-option.type';

export type Props = {
  isOpen: boolean;
  onClose: () => void;
  students: StudentOption[];
  onCreated?: (payload?: any) => void;
};
