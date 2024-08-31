import React from "react";
import StudentsTable from "../../common/components/StudentsTable";
import { data } from "../../common/Data/StudentsData";

const Alumnos = () => {
  return <StudentsTable data={data} caption="Alumnos" />;
};

export default Alumnos;
