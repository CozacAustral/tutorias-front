import { MeetingStatus } from "./meetings-status.type";

export type GetMeetingsResp = {
  total: number;
  page: number;
  limit: number;
  data: {
    id: number;
    date: string;
    time: string;
    location: string;
    status: MeetingStatus;

    computedStatus?: "PENDING" | "REPORTMISSING" | "COMPLETED";

    tutorship?: {
      student?: {
        id: number;
        user?: {
          name?: string;
          lastName?: string;
          email?: string;
        };
      };
      studentId?: number;
      tutorId?: number;
    };
  }[];
};
