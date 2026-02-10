"use client";

import {
  Box,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { UserService } from "../../services/admin-service";
import { MyTutor } from "./interfaces/my-tutor.interface";

export default function MyTutorPage() {
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

  if (loading) {
    return (
      <Flex height="100vh" bg="paleGray" justify="center" align="center">
        <Box textAlign="center">
          <Spinner size="xl" color="blue" borderWidth="3px" />
          <Text mt={2}>Cargando datos...</Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex height="100vh" bg="paleGray" flexDirection="column">
      <Flex justifyContent="center" alignItems="center" flex="1" mx="auto">
        <Container maxWidth="1200px" w="100%" p={4}>
          <Heading
            as="h1"
            fontFamily="'Montserrat', sans-serif"
            fontWeight="500"
            fontSize="4rem"
            textAlign={{ base: "center", md: "left" }}
            mb={1}
          >
            Mi Tutor
          </Heading>

          <Box
            bg="white"
            w="800px"
            h="auto"
            p={6}
            boxShadow="md"
            borderRadius="20px"
          >
            {!tutor ? (
              <Text>No tenés tutor asignado</Text>
            ) : (
              <>
                <VStack spacing={4} align="stretch" marginBottom="20px">
                  <HStack spacing={4} w="100%">
                    <FormControl>
                      <FormLabel>Nombre:</FormLabel>
                      <Input
                        value={tutor.name}
                        isReadOnly
                        bg="light_gray"
                        borderColor="light_gray"
                        borderWidth="3px"
                        borderRadius="15px"
                        h="50px"
                        w="90%"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Apellido:</FormLabel>
                      <Input
                        value={tutor.lastName}
                        isReadOnly
                        bg="light_gray"
                        borderColor="light_gray"
                        borderWidth="3px"
                        borderRadius="15px"
                        h="50px"
                        w="90%"
                      />
                    </FormControl>
                  </HStack>
                </VStack>

                <VStack spacing={4} align="stretch" marginBottom="20px">
                  <HStack spacing={4} w="100%">
                    <FormControl>
                      <FormLabel>Correo:</FormLabel>
                      <Input
                        value={tutor.email}
                        isReadOnly
                        bg="light_gray"
                        borderColor="light_gray"
                        borderWidth="3px"
                        borderRadius="15px"
                        h="50px"
                        w="90%"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Nro. de Teléfono:</FormLabel>
                      <Input
                        value={tutor.telephone ?? ""}
                        isReadOnly
                        bg="light_gray"
                        borderColor="light_gray"
                        borderWidth="3px"
                        borderRadius="15px"
                        h="50px"
                        w="90%"
                      />
                    </FormControl>
                  </HStack>
                </VStack>

                <VStack spacing={4} align="stretch">
                  <FormControl w="50%">
                    <FormLabel>Departamento:</FormLabel>
                    <Input
                      value={tutor.department?.name ?? ""}
                      isReadOnly
                      bg="light_gray"
                      borderColor="light_gray"
                      borderWidth="3px"
                      borderRadius="15px"
                      h="50px"
                      w="90%"
                    />
                  </FormControl>
                </VStack>
              </>
            )}
          </Box>
        </Container>
      </Flex>
    </Flex>
  );
}
