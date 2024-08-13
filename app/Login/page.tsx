'use client'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Flex, Stack, Box, Image, FormControl, Link, Input, Button, Text, FormHelperText, Container } from '@chakra-ui/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

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
      backgroundImage={'/images/image_158.png'}
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDirection="column"
        mb="2"
        justifyContent="center"
      >
        <Box>
          <form onSubmit={handleSubmit}>
            <Stack
              spacing={4}
              p='1rem'
              backgroundColor='#FCF5F9'
              borderRadius="10px"
              height="320px"
              w="538px"
              alignItems="center"
            >
              <Image
                src='/images/Image-Login-Photoroom.png'
                alt='Image-login'
                width="450px"
                h="112px"
                objectFit='contain'
              />
              {error && <Text color="red.500">{error}</Text>}
              <FormControl>
                <Input
                  borderRadius="3px"
                  border="none"
                  outline="none"
                  h="35px"
                  w='292px'
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
                  h="35px"
                  w='292px'
                  backgroundColor="#D4CBCB"
                  type='password'
                  placeholder='Contraseña'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  paddingLeft="1.5rem"
                />
                <FormHelperText textAlign="center">
                  <Link>Si olvidaste tu contraseña, recupérala aquí</Link>
                </FormHelperText>
              </FormControl>
              <Button
                borderRadius="5px"
                type="submit"
                backgroundColor="#172187"
                color="white"
                width="357px"
                height="42px"
                mt={4}
                isLoading={isLoading}
              >
                Iniciar Sesión
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
}

export default Login;
