"use client";

import { Td, Tr } from "@chakra-ui/react";
import { useState, Suspense } from "react"; // Importamos Suspense
import GenericTable from "../../common/components/generic-table";
import { CareerStudent } from "./interfaces/career-student.interface";

// 1. Renombramos el componente interno
const CarreraContent: React.FC = () => {
  const [career, setCareer] = useState<CareerStudent[]>([]);
  const [error, setError] = useState<string | null>(null);

  const TableHeader = ["Nombre Carrera", "Estado", "Año de ingreso"];

  const renderCarrerRow = (careerStudent: CareerStudent) => {
    return (
      <Tr key={careerStudent.id}>
        <Td>{careerStudent.Career.name}</Td>
        <Td>{careerStudent.active ? "activo" : "inactivo"}</Td>
        <Td>{new Date(careerStudent.student.yearEntry).getFullYear()}</Td>
      </Tr>
    );
  };

  return (
    <>
      {error && <p>{error}</p>}
      {career ? (
        <GenericTable
          data={career}
          TableHeader={TableHeader}
          renderRow={renderCarrerRow}
          caption="Carrera"
        />
      ) : (
        <p>Loading....</p>
      )}
    </>
  );
};

// 2. Exportamos el componente envuelto en Suspense
// Esto evita el error de prerendering en Vercel
export default function Carrera() {
  return (
    <Suspense fallback={<p>Cargando información...</p>}>
      <CarreraContent />
    </Suspense>
  );
}
