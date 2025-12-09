"use client";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { login, sendRecoveryEmail } from "./api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [mostrarRecuperacion, setMostrarRecuperacion] = useState(false);
  const [recoveryMessage, setRecoveryMessage] = useState("");

  const router = useRouter();
  const handleClick = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await login(email, password);
      Cookies.set("authTokens", data.accessToken, { expires: 7 });
      setError("");
      router.replace("/profile");
    } catch {
      setError("Error en la autenticación");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecovery = async () => {
    try {
      await sendRecoveryEmail(email);
      setRecoveryMessage(
        "Si el correo existe, se ha enviado un mail para restablecer la contraseña."
      );
    } catch {
      setRecoveryMessage("Hubo un error al enviar el correo.");
    }
  };

  return (
    <Container
      maxW="100vw"
      h="100vh"
      p={0}
      backgroundImage="/images/LoginBackground.png"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        textAlign="center"
        backgroundColor="softPink"
        p={6}
        pt={10}
        borderRadius="15px"
        shadow="md"
        width={{ base: "90%", sm: "70%", md: "50%", lg: "40%" }}
        height="500px"
        maxW="500px"
      >
        {!mostrarRecuperacion ? (
          <form onSubmit={handleSubmit}>
            <Stack spacing={4} alignItems="center">
              <Image
                src="/images/australCreatePassword.png"
                alt="Image-login"
                width="100%"
                maxWidth="450px"
                height="150px"
                objectFit="none"
                objectPosition="top"
              />

              {error && (
                <Text color="red.500" textAlign="center">
                  {error}
                </Text>
              )}

              <FormControl width="100%">
                <Input
                  borderRadius="8px"
                  h="42px"
                  backgroundColor="light_gray"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  paddingLeft="1.5rem"
                  width="100%"
                  marginTop="10px"
                  padding="21px"
                />
              </FormControl>

              <FormControl width="100%">
                <InputGroup>
                  <Input
                    borderRadius="8px"
                    h="42px"
                    backgroundColor="light_gray"
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    paddingLeft="1.5rem"
                    width="100%"
                    marginBottom="30px"
                    marginTop="17px"
                    padding="21px"
                  />
                  <InputRightElement height="100%">
                    <IconButton
                      aria-label="mostrar/ocultar contraseña"
                      icon={showPassword ? <HiEyeOff /> : <HiEye />}
                      onClick={handleClick}
                      position="absolute"
                      right="10px"
                      backgroundColor="light_gray"
                      top="43%"
                      transform="translateY(-50%)"
                      variant="link"
                      color="gray.900"
                      fontSize="24px"
                      pointerEvents="auto"
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                borderRadius="8px"
                type="submit"
                backgroundColor="primary"
                color="white"
                width="100%"
                maxW="300px"
                height="42px"
                mt={5}
                margin="6px"
                isLoading={isLoading}
              >
                Iniciar Sesión
              </Button>

              <FormControl>
                <FormHelperText textAlign="center" mt={4}>
                  <Link
                    color="primary"
                    fontWeight="bold"
                    onClick={() => setMostrarRecuperacion(true)}
                    cursor="pointer"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </FormHelperText>
              </FormControl>
            </Stack>
          </form>
        ) : (
          <Stack
            spacing={4}
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Text fontSize="lg" fontWeight="medium" textAlign="center">
              Ingrese su correo para restablecer la contraseña
            </Text>

            <FormControl width="100%">
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                borderRadius="8px"
                h="42px"
                backgroundColor="light_gray"
                paddingLeft="1.5rem"
                padding="21px"
              />
            </FormControl>

            <Button
              colorScheme="blue"
              onClick={handleRecovery}
              width="100%"
              maxW="300px"
              height="42px"
            >
              Enviar mail de recuperación
            </Button>

            {recoveryMessage && (
              <Text mt={2} color="green.500" textAlign="center">
                {recoveryMessage}
              </Text>
            )}

            <Button
              variant="link"
              onClick={() => setMostrarRecuperacion(false)}
              color="primary"
            >
              ← Volver al login
            </Button>
          </Stack>
        )}
      </Box>
    </Container>
  );
};

export default Login;
