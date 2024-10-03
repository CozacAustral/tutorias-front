"use client";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const CambiarContraseña = () => {
  const router = useRouter();

  const handleBack = () => {
    router.replace("/Profile");
  };
  return (
    <Container maxWidth="931px" w="100%" h="auto" p={4}>
      <Heading
        as="h1"
        size="2xl"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="500"
        mb={8}
        textAlign="left"
        ml={4}
      >
        Cambiar Contraseña
      </Heading>

      <Box
        bg="white"
        w="800px"
        p={8}
        boxShadow="md"
        borderRadius="20px"
        position="relative"
      >
        <FormControl mb={4}>
          <FormLabel htmlFor="current-password">Contraseña Actual:</FormLabel>
          <Input
            id="current-password"
            type="password"
            borderColor="light_gray"
            bg="paleGray"
            borderWidth="4px"
            borderRadius="15px"
            w="350px"
            h="50px"
            fontSize="lg"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel htmlFor="new-password">Nueva Contraseña:</FormLabel>
          <Input
            id="new-password"
            type="password"
            borderColor="light_gray"
            bg="paleGray"
            borderWidth="4px"
            borderRadius="15px"
            w="350px"
            h="50px"
            fontSize="lg"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel htmlFor="confirm-password">
            Confirmar Nueva Contraseña:
          </FormLabel>
          <Input
            id="confirm-password"
            type="password"
            borderColor="light_gray"
            bg="paleGray"
            borderWidth="4px"
            borderRadius="15px"
            w="350px"
            h="50px"
            fontSize="lg"
          />
        </FormControl>

        <Text
          fontSize="lg"
          p={2}
          borderRadius="md"
          position="absolute"
          right="20px"
          top="60px"
          maxWidth="400px"
          textAlign="right"
        >
          La contraseña debe tener 6 caracteres e incluir una combinación de
          números, letras y caracteres especiales (!$@%)
        </Text>

        <Flex direction="row" justify="flex-end" mt={12}>
          <Button
            bg="gray"
            color="black"
            w="150px"
            h="40px"
            borderRadius="6px"
            mr={4}
            onClick={handleBack}
          >
            Cancelar
          </Button>
          <Button
            bg="primary"
            color="white"
            w="160px"
            h="40px"
            borderRadius="6px"
          >
            Cambiar Contraseña
          </Button>
        </Flex>
      </Box>
    </Container>
  );
};

export default CambiarContraseña;
