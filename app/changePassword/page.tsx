"use client";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  List,
  ListItem,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  toastError,
  toastSuccess,
} from "../../common/feedback/toast-standalone";
import { UserService } from "../../services/admin-service";

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
      (value) => value === false,
    );

    if (validatePassoword) {
      setError((prevBool) => ({
        ...prevBool,
        errorRequirements: true,
      }));
      toastError({
        title: "Error!",
        description: "No se cumplen los requerimientos!",
      });
      return;
    }

    if (!match) {
      setError((prevBool) => ({
        ...prevBool,
        errorMatch: true,
      }));
      toastError({
        title: "Error!",
        description: "Las contraseñas son distintas!",
      });
      return;
    }

    try {
      await UserService.changePassword(
        currentPassword,
        newPassword,
        confirmNewPassword,
      );
      toastSuccess({
        title: "Contraseña cambiada!",
        description: "La contraseña fue cambiada con exito!",
      });
      router.push("/profile");
    } catch (err: any) {
      const description = axios.isAxiosError(err)
        ? (err.response?.data?.message?.[0] ??
          err.response?.data?.message ??
          err.response?.data?.error ??
          err.message)
        : "Ocurrió un error inesperado";

      toastError({
        title: "Error!",
        description,
      });
    }
  };

  const handleBack = () => {
    router.replace("/profile");
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
