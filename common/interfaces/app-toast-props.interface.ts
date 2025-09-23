import { AppToastStatus } from "../components/app-toast";

export interface AppToastProps {
  status: AppToastStatus;
  title: string;
  description?: string;
  onClose: () => void;
}