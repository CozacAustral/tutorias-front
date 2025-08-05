import React, { ReactNode, useState } from "react";
import {
  Box,
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
  InputRightElement,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Center,
} from "@chakra-ui/react";

import {
  Search2Icon,
  TriangleDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import Search from "../../app/ui/search";
import { useSidebar } from "../../app/contexts/SidebarContext";

interface GenericTableProps<T> {
  data: T[];
  caption: ReactNode;
  TableHeader: string[];
  renderRow: (row: T) => React.ReactNode;
  showAddMenu?: boolean;
  onImportOpen?: () => void;
  onCreateOpen?: () => void;
  topRightComponent?: React.ReactNode;
  showPagination?: boolean;
  currentPage?: number;
  itemsPerPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
}

const GenericTable = <T,>({
  data,
  caption,
  TableHeader,
  renderRow,
  showAddMenu = false,
  onImportOpen,
  onCreateOpen,
  topRightComponent,
  showPagination,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}: GenericTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { collapsed } = useSidebar();

  const rowSpacing = 0;

  const handleSearch = (term: string) => {
    setSearchTerm(term); 
  };

  const filteredData = data.filter((row) =>
    JSON.stringify(row).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const marginLeft = collapsed ? "6.5rem" : "15.625rem";

  return (
    <Flex
      justifyContent="flex-start"
      alignItems="flex-start"
      minHeight="100dvh"
      flexDirection="column"
      ml={marginLeft}
      pt={8}
    >
      <Box width="100%" maxWidth="1200px">
        <Text fontSize="6xl" color="black" marginLeft="5" marginBottom="3">
          {caption}
        </Text>
      </Box>
      <Box
        width="100%"
        maxWidth="1210px"
        backgroundColor="white"
        borderRadius="20px"
        p={4}
        mt="0"
      >
        <Flex
          mb={4}
          width="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex gap={2} width="100%">
            <Search onSearch={handleSearch} />

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
          </Flex>

          {topRightComponent && <Box ml={4}>{topRightComponent}</Box>}
        </Flex>

        <TableContainer>
          <Table
            variant="simple"
            size="sm"
            overflowX="hidden"
            overflowY="hidden"
            sx={{
              "td, th": {
                py: rowSpacing,
              },
            }}
          >
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
            <Tbody>
              {filteredData.map((row, index) => renderRow(row))}
            </Tbody>
          </Table>
        </TableContainer>

        {showPagination && currentPage !== undefined && totalItems !== undefined && (
          <Flex justifyContent="space-between" alignItems="center" mt={4}>
            <Button
              onClick={() => onPageChange?.(currentPage - 1)}
              isDisabled={currentPage === 1}
              leftIcon={<ChevronLeftIcon />}
            />

            <Text>
              Página {currentPage} de {Math.ceil(totalItems / (itemsPerPage ?? 1))}
            </Text>

            <Button
              onClick={() => onPageChange?.(currentPage + 1)}
              isDisabled={(currentPage * (itemsPerPage ?? 1)) >= totalItems}
              rightIcon={<ChevronRightIcon />}
            />
          </Flex>
        )}

      </Box>
    </Flex>
  );
};

export default GenericTable;
