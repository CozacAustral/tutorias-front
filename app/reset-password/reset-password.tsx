'use client';

import { Container, Image, Stack, Text, FormControl, Input, Box, IconButton, Button, FormHelperText, Link, InputGroup, InputRightElement} from '@chakra-ui/react'
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation';
import { createPassword } from './api'
import { CreatePasswordProps } from '../changePassword/interfaces/createPassword.interface'

const CreatePassword = ({ token, linkId } : CreatePasswordProps) => {
    const [showPassword, setShowPassword] = useState({
      password: false,
      confirmPassword: false
    });
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
          setSuccess(false)
        }
    }

    const handleSetPassword = (event: React.FormEvent<HTMLInputElement>) => {
      setPassword(event.currentTarget.value)
    }

    const handleRepeatPassword = (event: React.FormEvent<HTMLInputElement>) => {
      setRepeatPassword(event.currentTarget.value)
    }

    const handleClickPassword = () => {
      setShowPassword(prevBool => ({ ...showPassword, password: !prevBool.password}))
    }

     const handleClickConfirmPassword = () => {
      setShowPassword(prevBool => ({ ...showPassword, confirmPassword: !prevBool.confirmPassword}))
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
        pt={10}
        borderRadius="15px"
        shadow="md"
        width={{ base: "90%", sm: "70%", md: "50%", lg: "40%" }}
        height='500px'
        maxW="500px"
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={4} alignItems="center">
            <Image
              src="/images/australCreatePassword.png"
              alt="Image-login"
              width="100%"
              height="150px"
              objectFit="none"
              objectPosition='top'
            />

          <FormControl width="100%">
            <InputGroup>
              <Input
                borderRadius="8px"
                h="42px"
                backgroundColor="light_gray"
                type={showPassword.password ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={handleSetPassword}
                ref={errorPassword}
                width="100%"
                marginTop='10px'
                padding={'21px'}
                focusBorderColor={error ? 'red' : undefined}
              />
            <InputRightElement height={'100%'}>
              <IconButton
              aria-label="mostrar/ocultar contrasena"
              icon={showPassword.password ? <HiEyeOff/> : <HiEye/>}
              onClick={handleClickPassword}
              position='absolute'
              right='10px'
              backgroundColor="light_gray"
              top="58%"
              transform="translateY(-50%)"
              variant="link"
              color="gray.900"
              fontSize="24px"
              pointerEvents={'auto'}
              />
            </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl width="100%">
            <InputGroup>
             <Input
                borderRadius="8px"
                h="42px"
                backgroundColor="light_gray"
                type={showPassword.confirmPassword ? "text" : "password"}
                placeholder="Repetir Contraseña"
                value={repeatPassword}
                onChange={handleRepeatPassword}
                ref={errorRepeatPassword}
                paddingLeft="1.5rem"
                width="100%"
                marginBottom={'30px'}
                marginTop={'18px'}
                padding={'21px'}
                focusBorderColor={error ? 'red' : undefined}
              />
              <InputRightElement height={'100%'}>
                <IconButton
                aria-label="mostrar/ocultar contrasena"
                icon={showPassword.confirmPassword ? <HiEyeOff/> : <HiEye/>}
                onClick={handleClickConfirmPassword}
                position='absolute'
                right='10px'
                backgroundColor="light_gray"
                top="45%"
                transform="translateY(-50%)"
                variant="link"
                color="gray.900"
                fontSize="24px"
                pointerEvents={'auto'}
              />
              </InputRightElement>
            </InputGroup>
          </FormControl>

           {error && (
              <Text color="red" textAlign="center">
                {error}
              </Text>
            )}

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
