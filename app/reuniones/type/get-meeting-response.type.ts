type GetMeetingsResp = {
  data: {
    id: number;
    date: string;
    time: string;
    location: string;
    tutorship?: {
      student?: { id: number; user?: { name?: string; lastName?: string; email?: string } };
      studentId?: number;
      tutorId?: number;
    };
  }[];
  total: number;
  page: number;
  limit: number;
};
