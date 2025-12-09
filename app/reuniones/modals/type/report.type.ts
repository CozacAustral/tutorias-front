export type Report = {
  id: number;
  meetingId: number;
  topicos: string | null;
  comments: string | null;
  yearOfAdmission: number;
  career?: { id: number; name: string };
  meeting?: { date: string; time: string; location: string };
};
