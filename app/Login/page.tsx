'use client'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Stack, Box, Image, FormControl, Link, Input, Button, Text, FormHelperText, Container, InputGroup, InputRightElement } from '@chakra-ui/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const handleClick = () => setShowPassword(!showPassword);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Cookies.set('authTokens', data.accessToken, { expires: 7 }); // Guarda el token en cookies
        setError('');
        router.push('/'); // Redirige al usuario al dashboard
      } else {
        setError(data.message || 'Error en la autenticación');
      }
    } catch (error) {
      setError('Error en la autenticación');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      width="100vw"
      h="100vh"
      backgroundImage={'/images/LoginBackground.png'}
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        backgroundColor='#FCF5F9'
        p='1rem'
        borderRadius="10px"
        shadow="md"
        w={{ base: "90%", sm: "70%", md: "50%", lg: "40%" }}
      >
        <form onSubmit={handleSubmit}>
          <Stack
            spacing={4}
            p='1rem'
            borderRadius="10px"
            alignItems="center"
          >
            <Image
              src='/images/LoginFormImage.png'
              alt='Image-login'
              width="450px"
              h="112px"
              objectFit='contain'
            />
            {error && <Text color="red.500" textAlign="center">{error}</Text>}
            
            <FormControl>
              <Input
                borderRadius="3px"
                border="none"
                outline="none"
                h="42px"
                w='350px'
                type='email'
                placeholder='Email'
                backgroundColor="#D9D9D9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                paddingLeft="1.5rem"
              />
            </FormControl>
            
            <FormControl>
                <Input
                  borderRadius="3px"
                  border="none"
                  outline="none"
                  h="42px"
                  w='350px'
                  backgroundColor="#D9D9D9"
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Contraseña'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  paddingLeft="1.5rem"
                />
            </FormControl>
            
            <Button
              borderRadius="5px"
              type="submit"
              backgroundColor="#172187"
              color="white"
              width="100%"
              maxW='300px'
              height="42px"
              mt={4}
              isLoading={isLoading}
            >
              Iniciar Sesión
            </Button>
            
            <FormControl>
              <FormHelperText textAlign="center" mt={4}>
                <Link>Si olvidaste tu contraseña, recupérala aquí</Link>
              </FormHelperText>
            </FormControl>
          </Stack>
        </form>
      </Box>
    </Container>
  );
}

export default Login;
