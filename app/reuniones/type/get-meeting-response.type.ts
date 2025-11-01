import { MeetingStatus } from './meetings-status.type';

export type GetMeetingsResp = {
  data: {
    id: number;
    date: string;
    time: string;
    location: string;
    status: MeetingStatus;
    tutorship?: {
      student?: {
        id: number;
        user?: { name?: string; lastName?: string; email?: string };
      };
      studentId?: number;
      tutorId?: number;
    };
  }[];
  total: number;
  page: number;
  limit: number;
};
