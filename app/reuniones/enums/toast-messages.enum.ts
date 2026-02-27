export enum ReunionestoastMessages {
  SCHEDULE_SUCCESS_TITLE = "Reunión agendada",
  SCHEDULE_SUCCESS_DESC = "La reunión ha sido agendada correctamente.",

  SCHEDULE_ERROR_TITLE = "Error al agendar reunión",
  SCHEDULE_ERROR_DESC = "Ocurrió un error al intentar agendar la reunión. Intenta nuevamente.",

  SEND_REPORT_SUCCESS_TITLE = "Reporte enviado al alumno",
  SEND_REPORT_SUCCESS_DESC = "El reporte ha sido enviado correctamente al correo del alumno.",

  SEND_REPORT_ERROR_TITLE = "Error al enviar el reporte",
  SEND_REPORT_ERROR_DESC = "No se pudo enviar el reporte al alumno. Por favor, intentá nuevamente más tarde.",

  CREATE_REPORT_SUCCESS_TITLE = "Reporte creado",
  CREATE_REPORT_SUCCESS_DESC = "El reporte ha sido creado correctamente.",
}

export enum ReunionesConfirmToastMessages {
  CONFIRM_SEND_REPORT = "Esta acción enviará el contenido del reporte al alumno correspondiente. ¿Estas seguro que desea continuar?",
}

export enum ReunionesCreateConfirmToastMessages {
  CREATE_CONFIRM_REPORT = "Esta acción es permanente. Una vez creado, el reporte nopodrá editarse. ¿Deseás continuar?",
}
