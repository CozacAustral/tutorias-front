import React, { useState } from "react";
import {
  Box,
  ChakraProvider,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Button,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,

} from "@chakra-ui/react";

import { SmallAddIcon, Search2Icon, TriangleDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Search from "../../app/ui/search";


interface GenericTableProps<T> {
  data: T[];
  caption: string;
  TableHeader: string[];
  renderRow: (row: T) => React.ReactNode;
  showAddMenu?: boolean;
  onImportOpen?: () => void;
  onCreateOpen?: () => void;
  addItemLabel?: string ;
}

const GenericTable = <T,>({
  data,
  caption,
  TableHeader,
  renderRow,
  showAddMenu = false,
  onImportOpen,
  onCreateOpen,
  addItemLabel = ' Item'
}: GenericTableProps<T>) => {
  const itemsPerPage = 3
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("")
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const filteredData = data.filter((row) => 
    JSON.stringify(row).toLowerCase().includes(searchTerm.toLowerCase())
)

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const nextPage = () => {
    if (endIndex < filteredData.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1){
      setCurrentPage((prev) => prev - 1)
    }
  }


  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      flexDirection="column"
      mt="-20"
    >
      <Box width="100%" maxWidth="1200px" mb={4}>
        <Text
          fontSize="6xl"
          color="black"
          marginLeft="-25"
          marginTop="-30"
          marginBottom="3"
        >
          {caption}
        </Text>
      </Box>
      <Box
        width="100%"
        maxWidth="1210px"
        backgroundColor="white"
        borderRadius="20px"
        p={4}
        mt="-25"
      >
        <Flex mb={4} width="100%">
          {/*Componete busqueda o search */}
          <Search onSearch={handleSearch}/>

          <Menu>
            <MenuButton as={InputGroup} width="30%" mr={2}>
              <Input placeholder="Ordenar por..." readOnly />
              <InputRightElement pointerEvents="none">
                <TriangleDownIcon color="black" />
              </InputRightElement>
            </MenuButton>
            <MenuList>
              <MenuItem>De la A - Z</MenuItem>
              <MenuItem>De la Z - A</MenuItem>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={InputGroup} width="30%" mr={2}>
              <Input placeholder="Filtrar por..." readOnly />
              <InputRightElement pointerEvents="none">
                <TriangleDownIcon color="black" />
              </InputRightElement>
            </MenuButton>
            <MenuList>
              <MenuItem>Carrera</MenuItem>
              <MenuItem>Año de Ingreso</MenuItem>
            </MenuList>
          </Menu>

        { showAddMenu && (
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Opciones"
              icon={<SmallAddIcon />}
            />
            <MenuList>
              <MenuItem onClick={onCreateOpen}>Crear {addItemLabel}</MenuItem>
              <MenuItem onClick={onImportOpen}>Importar {addItemLabel}</MenuItem>
            </MenuList>
          </Menu>
        )}
        </Flex>
        <TableContainer>
          <Table variant="simple" size="md" overflowX={"hidden"} overflowY={"hidden"}>
            <Thead>
              <Tr>
                {TableHeader.map((header, index) => (
                  <Th key={index} fontWeight={600} color="#B5B7C0">
                    {header}
                  </Th>
                ))}
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>{currentData.map((row, index) => renderRow(row))}</Tbody>
          </Table>
        </TableContainer>
        <Flex justifyContent="space-between" mt={4}>
          <Button onClick={prevPage} isDisabled={currentPage === 1} leftIcon={<ChevronLeftIcon/>}>
          </Button>
          <Text> Página {currentPage}/{totalPages}</Text>
          <Button onClick={nextPage} isDisabled={endIndex >= filteredData.length} rightIcon={<ChevronRightIcon/>}>
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default GenericTable;