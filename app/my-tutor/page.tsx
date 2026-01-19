"use client";

import {
  Box,
  Flex,
  Heading,
  Input,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { UserService } from "../../services/admin-service";
import { useSidebar } from "../contexts/SidebarContext";
import { MyTutor } from "./interfaces/my-tutor.interface";

export default function MyTutorPage() {
  const { collapsed } = useSidebar();
  const [tutor, setTutor] = useState<MyTutor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const data = await UserService.fetchMyTutor();
        setTutor(data);
      } finally {
        setLoading(false);
      }
    };
    fetchTutor();
  }, []);

  return (
    <Box
      ml={collapsed ? "15rem" : "15.5rem"}
      mr={collapsed ? "15rem" : "10.5rem"}
      mt={collapsed ? "10rem" : "10.5rem"}
      mb={collapsed ? "10rem" : "10.5rem"}
      p={8}
      transition="margin-left 0.3s ease"
      minH="100vh"
      bg="#ffffff"
    >
      <Heading mb={6}>Mi Tutor</Heading>

      {loading ? (
        <Spinner />
      ) : tutor ? (
        <Flex justify="center">
          <Box
            bg="white"
            p={8}
            borderRadius="16px"
            maxW="900px"
            w="100%"
            boxShadow="sm"
          >
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
              <Input value={tutor.name} isReadOnly placeholder="Nombre" />
              <Input value={tutor.lastName} isReadOnly placeholder="Apellido" />
              <Input value={tutor.email} isReadOnly placeholder="Correo" />
              <Input
                value={tutor.telephone ?? ""}
                isReadOnly
                placeholder="Teléfono"
              />
              <Input
                gridColumn={{ md: "span 2" }}
                value={tutor.department?.name ?? ""}
                isReadOnly
                placeholder="Departamento"
              />
            </SimpleGrid>
          </Box>
        </Flex>
      ) : (
        <Box>No tenés tutor asignado</Box>
      )}
    </Box>
  );
}
