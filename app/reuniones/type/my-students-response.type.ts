import { studentlike } from './student-like.type';

export type GetMyStudentsResp =
{ data?: { data?: studentlike[]; students?: studentlike[] } | studentlike[] };
