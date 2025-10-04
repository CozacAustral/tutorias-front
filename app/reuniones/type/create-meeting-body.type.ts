export type CreateMeetingBody = {
  studentId: number;
  date: string;   // ISO
  time: string;   // HH:mm
  location: string;
};
