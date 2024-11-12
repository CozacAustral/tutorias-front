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
} from "@chakra-ui/react";
import { login } from "./api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const handleClick = () => setShowPassword(!showPassword);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const data = await login(email, password);
      Cookies.set("authTokens", data.accessToken, { expires: 7 });
      setError("");
      router.push("/"); // Redirige al usuario al dashboard
    } catch (error) {
      setError("Error en la autenticación");
    } finally {
      setIsLoading(false);
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
        borderRadius="10px"
        shadow="md"
        width={{ base: "90%", sm: "70%", md: "50%", lg: "40%" }}
        maxW="500px"
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={4} alignItems="center">
            <Image
              src="/images/LoginFormImage.png"
              alt="Image-login"
              width="100%"
              maxWidth="450px"
              height="auto"
              objectFit="contain"
            />

            {error && (
              <Text color="red.500" textAlign="center">
                {error}
              </Text>
            )}

            <FormControl width="100%">
              <Input
                borderRadius="3px"
                h="42px"
                backgroundColor="light_gray"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                paddingLeft="1.5rem"
                width="100%"
              />
            </FormControl>

            <FormControl width="100%">
              <Input
                borderRadius="3px"
                h="42px"
                backgroundColor="light_gray"
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                paddingLeft="1.5rem"
                width="100%"
              />
              <IconButton
              aria-label="mostrar/ocultar contrasena"
              icon={showPassword ? <HiEyeOff/> : <HiEye/>}
              onClick={handleClick}
              position='absolute'
              right='10px'
              backgroundColor="light_gray"
              top="50%"
              transform="translateY(-50%)"
              variant="link"
              color="gray.900"
              fontSize="24px"
              />
            </FormControl>

            <Button
              borderRadius="5px"
              type="submit"
              backgroundColor="primary"
              color="white"
              width="100%"
              maxW="300px"
              height="42px"
              mt={4}
              isLoading={isLoading}
            >
              Iniciar Sesión
            </Button>

            <FormControl>
              <FormHelperText textAlign="center" mt={4}>
                Si olvidaste tu contraseña, recupérala{" "}
                <Link href="" color="primary" fontWeight="bold">
                  aquí
                </Link>
              </FormHelperText>
            </FormControl>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
