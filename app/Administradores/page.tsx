import React from "react";
import GenericTable from "../../common/components/GenericTable";
import { data } from "../../common/data/data";
import { Flex } from "@chakra-ui/react";

const Administradores = () => {
  return <GenericTable data={data} caption="Administradores" />;
};

export default Administradores;
