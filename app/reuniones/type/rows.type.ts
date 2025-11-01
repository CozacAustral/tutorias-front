import { MeetingRow } from './meeting-row.type';
import { MeetingStatus } from './meetings-status.type';

export type Row = Omit<MeetingRow, "status" | "fechaHora"> & {
  fecha: string;
  hora: string;
  status: MeetingStatus;
  fechaHora?: string;
  studentId?: number;
  tutorId?: number;
};
