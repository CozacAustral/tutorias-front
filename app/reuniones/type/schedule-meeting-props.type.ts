import { StudentOption } from './student-option.type';

export type ScheduleMeetingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  students?: StudentOption[];
  onCreated?: (resp: any) => void;
  defaultStudentId?: number;
};
