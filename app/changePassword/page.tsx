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
  Toast,
  useToast,
  List,
  ListItem,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { MouseEventHandler, useEffect, useState } from "react";
import { UserService } from "../../services/admin-service";
import { AuthService } from "../../services/auth-service";

const CambiarContraseña = () => {
  const router = useRouter();
  const toast = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [requirements, setRequirements] = useState({
    length: false,
    number: false,
    letter: false,
    special: false,
  });
  const [match, setMatch] = useState(true);
  const [error, setError] = useState({
    errorPasswordBack: false,
    errorRequirements: false,
    errorMatch: false,
  });

  const handleCurrentPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmNewPassword(e.target.value);
  };

  useEffect(() => {
    setRequirements({
      length: newPassword.length >= 6,
      number: /\d/.test(newPassword),
      letter: /[a-zA-Z]/.test(newPassword),
      special: /[!$@%]/.test(newPassword),
    });
  }, [newPassword]);

  useEffect(() => {
    if (!confirmNewPassword) return;
    setMatch(newPassword === confirmNewPassword);
  }, [newPassword, confirmNewPassword]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const validatePassoword = Object.values(requirements).some(
      (value) => value === false
    );

    if (validatePassoword) {
      setError((prevBool) => ({
        ...prevBool,
        errorRequirements: true,
      }));
      toast({
        title: "Error!",
        description: "No se cumplen los requerimientos!",
        duration: 3000,
        isClosable: true,
        status: "error",
      });
      return;
    }

    if (!match) {
      setError((prevBool) => ({
        ...prevBool,
        errorMatch: true,
      }));
      toast({
        title: "Error!",
        description: "Las contraseñas son distintas!",
        duration: 3000,
        isClosable: true,
        status: "error",
      });
      return;
    }

    try {
      await UserService.changePassword(currentPassword, newPassword);
      toast({
        title: "Contraseña cambiada!",
        description: "La contraseña fue cambiada con exito!",
        duration: 3000,
        isClosable: true,
        status: "success",
      });
      router.push("/Profile");
    } catch (err: any) {
      toast({
        title: "Error!",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleBack = () => {
    router.replace("/Profile");
  };

  return (
    <Container maxWidth="850px" w="100%" h="auto" p="50px">
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
            value={currentPassword}
            onChange={handleCurrentPassword}
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
            value={newPassword}
            onChange={handleNewPassword}
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
            value={confirmNewPassword}
            onChange={handleConfirmNewPassword}
            borderColor="light_gray"
            bg="paleGray"
            borderWidth="4px"
            borderRadius="15px"
            w="350px"
            h="50px"
            fontSize="lg"
          />
        </FormControl>

        <Box
          fontSize="lg"
          p={2}
          borderRadius="md"
          pos="absolute"
          right="10px"
          top="40%"
          transform="translateY(-50%)"
          maxWidth="400px"
        >
          <List spacing={2}>
            <ListItem
              color={
                !requirements.length && error.errorRequirements
                  ? "red.500"
                  : requirements.length
                  ? "green.500"
                  : "red"
              }
              transition="color 0.3s ease"
            >
              • Al menos 6 caracteres
            </ListItem>
            <ListItem
              color={
                !requirements.length && error.errorRequirements
                  ? "red.500"
                  : requirements.number
                  ? "green.500"
                  : "red"
              }
              transition="color 0.3s ease"
            >
              • Al menos un número
            </ListItem>
            <ListItem
              color={
                !requirements.length && error.errorRequirements
                  ? "red.500"
                  : requirements.letter
                  ? "green.500"
                  : "red"
              }
              transition="color 0.3s ease"
            >
              • Al menos una letra
            </ListItem>
            <ListItem
              color={
                !requirements.length && error.errorRequirements
                  ? "red.500"
                  : requirements.special
                  ? "green.500"
                  : "red"
              }
              transition="color 0.3s ease"
            >
              • Al menos un carácter especial (!$@%)
            </ListItem>
          </List>
        </Box>

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
            w="170px"
            h="40px"
            borderRadius="6px"
            onClick={handleSubmit}
          >
            Cambiar Contraseña
          </Button>
        </Flex>
      </Box>
    </Container>
  );
};

export default CambiarContraseña;
