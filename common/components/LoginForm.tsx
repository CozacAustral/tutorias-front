import { Flex, Stack, Box, Image, FormControl, InputGroup, Input, Button, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await userLogin({ email, password });
      setSuccess('Inicio de sesión exitoso');
      setError('');
      setIsLoading(false);
      setIsLoggedIn(true);
      router.push('/');
    } catch (error) {
      setError('Email o contraseña incorrectos');
      setSuccess('');
      setIsLoading(false);
      setEmail('');
      setPassword('');
    }
  };

  const userLogin = async ({ email, password }) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email === 'test@email.com' && password === 'password') {
          resolve(); 
        } else {
          reject(new Error('Invalid credentials')); 
        }
      }, 1000);
    });
  };

  return (
    <Flex
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
              height="300px"
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
              {success && <Text color="green.500">{success}</Text>}
              <FormControl>
                <Input
                borderRadius="3px"
                border="none"
                outline="none"
                h="35px"
                w='290px'
                type='email'
                placeholder='Email'
                backgroundColor="#D4CBCB"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                paddingLeft="1rem"
                />
                </FormControl>
                <FormControl>
                  <Input
                  borderRadius="3px"
                  border="none"
                  outline="none"
                  h="35px"
                  w='290px'
                  backgroundColor="#D4CBCB"
                  type='password'
                  placeholder='Contraseña'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  paddingLeft="1rem"
                  />
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
    </Flex>
  );
}

export default LoginForm;
