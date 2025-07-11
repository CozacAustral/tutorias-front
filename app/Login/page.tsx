"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { HiEye, HiEyeOff } from "react-icons/hi";
import React, { useState } from "react";
import {
  Stack,
  Box,
  Image,
  FormControl,
  Link,
  Input,
  Button,
  Text,
  FormHelperText,
  Container,
  IconButton,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { login, sendRecoveryEmail } from "./api"; // Asegurate de agregar esta función

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const data = await login(email, password);
      Cookies.set("authTokens", data.accessToken, { expires: 7 });
      setError("");
      router.push("/");
    } catch (error) {
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
        height='500px'
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
                height='150px'
                objectFit="none"
                objectPosition='top'
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
                    marginTop='10px'
                    padding='21px'
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
                  marginBottom={'30px'}
                  marginTop='17px'
                  padding='21px'
                />
                <InputRightElement height={'100%'}>
                  <IconButton
                  aria-label="mostrar/ocultar contrasena"
                  icon={showPassword ? <HiEyeOff /> : <HiEye />}
                  onClick={handleClick}
                  position="absolute"
                  right="10px"
                  backgroundColor="light_gray"
                  top="39%"
                  transform="translateY(-50%)"
                  variant="link"
                  color="gray.900"
                  fontSize="24px"
                  pointerEvents={'auto'}
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
                margin={'6px'}
                isLoading={isLoading}
              >
                Iniciar Sesión
              </Button>

              <FormControl>
                <FormHelperText textAlign="center" mt={4}>
                  ¿Olvidaste tu contraseña?{" "}
                  <Link
                    color="primary"
                    fontWeight="bold"
                    onClick={() => setMostrarRecuperacion(true)}
                    cursor="pointer"
                  >
                    Recuperala aquí
                  </Link>
                </FormHelperText>
              </FormControl>
            </Stack>
          </form>
        ) : (
          <Box>
            <Text mb={4}>Ingrese su correo para restablecer la contraseña</Text>
            <FormControl>
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <Button
              mt={4}
              colorScheme="blue"
              onClick={handleRecovery}
              width="100%"
            >
              Enviar mail de recuperación
            </Button>
            {recoveryMessage && (
              <Text mt={3} color="green.500">
                {recoveryMessage}
              </Text>
            )}
            <Button
              variant="link"
              mt={3}
              onClick={() => setMostrarRecuperacion(false)}
              color="primary"
            >
              ← Volver al login
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Login;
