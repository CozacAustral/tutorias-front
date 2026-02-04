import React from "react";
import { Badge } from "@chakra-ui/react";
import { MeetingStatus } from "../type/meetings-status.type";

export function statusBadge(status: MeetingStatus) {
  const label =
    status === "COMPLETED"
      ? "Completada"
      : status === "PENDING"
        ? "Pendiente"
        : status === "REPORTMISSING"
          ? "Falta reporte"
          : "—";

  switch (status) {
    case "COMPLETED":
      return (
        <Badge colorScheme="green" textTransform="none">
          {label}
        </Badge>
      );
    case "PENDING":
      return (
        <Badge colorScheme="gray" textTransform="none">
          {label}
        </Badge>
      );
    case "REPORTMISSING":
      return (
        <Badge colorScheme="yellow" textTransform="none">
          {label}
        </Badge>
      );
    default:
      return <Badge textTransform="none">—</Badge>;
  }
}
