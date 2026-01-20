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
    <Flex
      minH="100vh"
      bg="gray.50"
      ml={collapsed ? "6rem" : "12rem"}
      px={6}
    >
      <Flex
        flex="1"
        justify="center"
        align="center"
      >
        <Box
          bg="white"
          borderRadius="2xl"
          boxShadow="md"
          p={10}
          w="100%"
          maxW="900px"
        >
          <Heading mb={8}>Mi Tutor</Heading>

          {loading ? (
            <Spinner />
          ) : tutor ? (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Input value={tutor.name} isReadOnly />
              <Input value={tutor.lastName} isReadOnly />
              <Input value={tutor.email} isReadOnly />
              <Input value={tutor.telephone ?? ""} isReadOnly />
              <Input
                gridColumn={{ md: "span 2" }}
                value={tutor.department?.name ?? ""}
                isReadOnly
              />
            </SimpleGrid>
          ) : (
            <Box>No tenés tutor asignado</Box>
          )}
        </Box>
      </Flex>
    </Flex>
  );
}
