import React from "react";
import GenericTable from "../../common/components/GenericTable";
import { data } from "../../common/data/data";
import { Flex } from "@chakra-ui/react";

const Administradores = () => {
  return (
    <div className="table_div">
      Administradores
      <GenericTable data={data} caption="Lista de Administradores" />
    </div>
  );
};

export default Administradores;
