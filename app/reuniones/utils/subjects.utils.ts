export const SUBJECT_STATE_LABELS: Record<string, string> = {
  APPROVED: "Aprobada",
  REGULARIZED: "Regularizada",
  FREE: "Libre",
  INPROGRESS: "En curso",
  NOTATTENDED: "No cursada",
  RETAKING: "Recursando",
};

export function normalizeSubjectStateKey(subjectState: unknown) {
  return String(subjectState ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s_]/g, "");
}

export function subjectStateLabel(subjectState: unknown) {
  const key = normalizeSubjectStateKey(subjectState);
  return SUBJECT_STATE_LABELS[key] ?? String(subjectState ?? "—");
}

export function subjectStateValueForSelect(subjectState: unknown) {
  const key = normalizeSubjectStateKey(subjectState);
  if (key in SUBJECT_STATE_LABELS) return key;
  return String(subjectState ?? "").trim().toUpperCase();
}
