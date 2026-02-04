import { useCallback, useEffect, useMemo, useState } from "react";
import { Filters } from "../type/filters.type";
import { GetMeetingsResp } from "../type/get-meeting-response.type";
import { Row } from "../type/rows.type";
import { UserService } from '../../../services/admin-service';
import { fullName, formatFecha, formatHora } from '../utils/format.utils';


export function useMeetings(limit: number) {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [myTutorId, setMyTutorId] = useState<number | null>(null);

  const [filters, setFilters] = useState<Filters>({
    status: "all",
    order: "desc",
  });

  const loadMeetings = useCallback(
    async (pages = page) => {
      setLoading(true);
      try {
        const meetingsRes = await UserService.getMeetings(pages, limit, {
          ...filters,
        });

        let foundTutorId: number | null = null;

        const mapped: Row[] = (meetingsRes.data ?? []).map(
          (meeting: GetMeetingsResp["data"][number]) => {
            const student = meeting?.tutorship?.student ?? null;
            const alumno = fullName(student?.user ?? null);

            const fecha = formatFecha(meeting.date);
            const hora = formatHora(meeting.date);

            const row: Row = {
              id: meeting.id,
              tutor: "—",
              alumno,
              fecha,
              hora,
              fechaHora: `${fecha} ${hora}`,
              aula: meeting.location,
              status: meeting.computedStatus ?? meeting.status,
              studentId:
                student?.id ?? meeting?.tutorship?.studentId ?? undefined,
              tutorId: meeting?.tutorship?.tutorId ?? undefined,
            };

            if (!foundTutorId && row.tutorId) foundTutorId = row.tutorId;
            return row;
          },
        );

        if (foundTutorId) setMyTutorId(foundTutorId);

        setRows(mapped);
        setTotal(meetingsRes.total ?? mapped.length);
      } catch {
        setRows([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [filters, limit, page],
  );

  useEffect(() => {
    loadMeetings(page);
  }, [page, loadMeetings]);

  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);
  useEffect(() => {
    loadMeetings(1);
  }, [filtersKey]);

  return {
    page,
    setPage,
    rows,
    total,
    loading,
    myTutorId,
    filters,
    setFilters,
    loadMeetings,
  };
}
