'use client';

import { Container, Image, Stack, Text, FormControl, Input, Box, IconButton, Button, FormHelperText, Link} from '@chakra-ui/react'
import { HiEye, HiEyeOff } from "react-icons/hi"; 
import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation';
import { createPassword } from './api'
import { CreatePasswordProps } from '../interfaces/createPassword.interface'

const CreatePassword = ({ token, linkId } : CreatePasswordProps) => {  
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState('')
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false)
    const errorPassword = useRef<HTMLInputElement>(null)
    const errorRepeatPassword= useRef<HTMLInputElement> (null)
    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (!password){
          setError('Debe ingresar una contraseña')
          errorPassword.current?.focus()
          return;
        }

        if (!repeatPassword){
          setError('Debe ingresar la confirmacion de su nueva contraseña')
          errorRepeatPassword.current?.focus()
          return;
        }

        if (password != repeatPassword) {
          setError('Las contraseñas tienen que coincidir!')
          errorPassword.current?.focus()
          errorRepeatPassword.current?.focus()
          return;
        }
        
        try{
          await createPassword(token, password)
          setSuccess(true);
          setTimeout(() => router.push('/Login'), 2000)
        } catch(error) {
          setError('Error al establecer la contraseña')
        }
    }   

    const handleSetPassword = (event: React.FormEvent<HTMLInputElement>) => {
      setPassword(event.currentTarget.value)
    }

    const handleRepeatPassword = (event: React.FormEvent<HTMLInputElement>) => {
      setRepeatPassword(event.currentTarget.value)
    }

    const handleClick = () => {
        setShowPassword(prevBool => !prevBool);
    }

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
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={handleSetPassword}
                ref={errorPassword}
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
                placeholder="Repetir Contraseña"
                value={repeatPassword}
                onChange={handleRepeatPassword}
                ref={errorRepeatPassword}
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
            >
              Crear Contraseña
            </Button> 
          </Stack>
        </form>
      </Box>
    </Container>
  )
}

export default CreatePassword