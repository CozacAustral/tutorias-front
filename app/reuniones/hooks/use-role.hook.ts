import { useMemo } from "react";
export type MeUserLike = {
  role?: number | string | { id: number; name: string } | null;
} | null;

export function useRole(me: MeUserLike) {
  const isAdmin = useMemo(() => {
    if (!me?.role) return false;
    if (typeof me.role === "string") return me.role.toUpperCase() === "ADMIN";
    if (typeof me.role === "number") return me.role === 1;
    if (typeof me.role === "object") return me.role.name === "ADMIN";
    return false;
  }, [me]);

  const isTutor = useMemo(() => {
    if (!me?.role) return false;
    if (typeof me.role === "string") return me.role.toUpperCase() === "TUTOR";
    if (typeof me.role === "number") return me.role === 2;
    if (typeof me.role === "object") return me.role.name === "TUTOR";
    return false;
  }, [me]);

  const normalizedRole = useMemo(() => {
    if (!me?.role) return 0;
    if (typeof me.role === "number") return me.role;
    if (typeof me.role === "string") {
      if (me.role.toUpperCase() === "ADMIN") return 1;
      if (me.role.toUpperCase() === "TUTOR") return 2;
    }
    if (typeof me.role === "object") return me.role.id;
    return 0;
  }, [me]);

  return { isAdmin, isTutor, normalizedRole };
}
