import { AppToastStatus } from '../type/app-toast-status.type';

export interface AppToastProps {
  status: AppToastStatus;
  title: string;
  description?: string;
  onClose: () => void;
}
