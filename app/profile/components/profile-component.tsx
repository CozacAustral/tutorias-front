import { EditIcon } from "@chakra-ui/icons"
import {
  Modal,
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Switch,
  VStack,
  Flex,
  IconButton,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
  Text,
  Spinner,
  Heading,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { AuthService } from "../../../services/auth-service"
import { UserService } from "../../../services/admin-service";
import { PatchMeUser } from "../../../app/interfaces/patch-me-user.interface";

const jwt = require("jsonwebtoken");

const ProfileComponent = () => {
  const [role, setRole] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userData, setUserData] = useState<PatchMeUser>({
    name: "",
    lastName: "",
    email: "",
    telephone: "",
    departamentId: 0,
  });
  const [isDelete, setIsDelete] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const toast = useToast();
  const router = useRouter();

  const nameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const telephoneRef = useRef<HTMLInputElement>(null);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userData?.name) {
      setError("Debes ingresar el nuevo nombre del perfil");
      nameRef.current?.focus();
      return;
    }

    if (!userData?.lastName) {
      setError("Debes ingresar el nuevo apellido del perfil");
      lastNameRef.current?.focus();
      return;
    }

    if (!userData?.email) {
      setError("Debes ingresar el nuevo mail del perfil");
      emailRef.current?.focus();
      return;
    }

    if (!userData?.telephone) {
      setError("Debes ingresar el nuevo teléfono del perfil");
      telephoneRef.current?.focus();
      return;
    }
    
    try {
      await UserService.patchMeUser(userData);
      setSuccess(true);
      toast({
        title: "Estudiante editado",
        description: "El estudiante fue editado con exito",
        duration: 3000,
        isClosable: true,
        status: "success",
      });
      setIsEditing(false);
    } catch (error) {
      setError("Error al actualizar el perfil");
      setSuccess(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleDelete = () => {
    console.log("password:", password);
    setIsDelete(true);
    onClose();
  };

  const handleChangePassword = () => {
    router.push("/changePassword");
  };

  useEffect(() => {
    const fetchUserData = async () => {
    const data = await AuthService.getUserInfo();
    setUserData(data);
    console.log(data);
    setIsLoading(false);
  };
    const token = Cookies.get("authTokens");
    if (!token) return console.log("No token found");

    try {
      const decodedToken = jwt.decode(token);
      console.log("INFORMACION DEL TOKEN", decodedToken);
      setRole(decodedToken.role);
    } catch (error) {
      console.error("Error al decodificar el token:", error);
    }

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <Box textAlign="center" padding="20px">
        <Spinner size="xl" color="blue" borderWidth="3px" />
        <Text>Cargando datos...</Text>
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box textAlign="center" padding="20px">
        <Text>No se pudieron obtener los datos del usuario</Text>
      </Box>
    );
  }

  return (
    <Container maxWidth="1200px" w="100%" h="auto" p={4}>
      <Heading
        as="h1"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="500"
        fontSize="4rem"
        textAlign={{ base: "center", md: "left" }}
        mb={6}
      >
        Mi Perfil
      </Heading>

      <Box
        bg="white"
        w="800px"
        h="auto"
        p={8}
        boxShadow="md"
        borderRadius="20px"
      >
        <IconButton
          icon={<EditIcon />}
          aria-label="Editar perfil"
          _hover={{ bg: "light_gray" }}
          transition="background-color 0.3s ease"
          size="lg"
          fontSize="24px"
          h="40px"
          w="40px"
          position="fixed"
          top="20px"
          right="200px"
          zIndex={1000}
          onClick={toggleEdit}
        />

        <Button
          bg="red"
          color="white"
          w="150px"
          h="40px"
          position="fixed"
          top="20px"
          right="30px"
          zIndex={1000}
          onClick={() => {
            console.log("Botón clickeado");
            onOpen();
          }}
        >
          Eliminar Cuenta
        </Button>

        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              ¿Estás seguro que deseas realizar esta acción?
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p>
                Si es así, ingresa tu contraseña y eliminaremos tu cuenta de{" "}
                <span style={{ fontWeight: "bold" }}>inmediato</span>.
              </p>
              <FormControl mb={6} mt={4}>
                <FormLabel htmlFor="current-password" fontWeight="bold">
                  Contraseña Actual:
                </FormLabel>
                <Input
                  id="current-password"
                  type="password"
                  borderColor="light_gray"
                  borderWidth="3px"
                  borderRadius="15px"
                  w="100%"
                  h="50px"
                  fontSize="md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button bg="red" color="white" onClick={handleDelete}>
                Eliminar Cuenta
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {error && isEditing ? (
          <Text color="red" textAlign="center" marginBottom="30px" fontSize='19px'>
            {error}
          </Text>
        ) : undefined}

        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch" marginBottom='20px'>
            <HStack spacing={4} w="100%">
              <FormControl>
                <FormLabel>Nombre:</FormLabel>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  borderColor="light_gray"
                  value={userData.name}
                  onChange={handleInputChange}
                  ref={nameRef}
                  bg={isEditing ? "light_gray" : "paleGray"}
                  isReadOnly={!isEditing}
                  focusBorderColor={error ? "red" : undefined}
                  borderWidth="3px"
                  borderRadius="15px"
                  w="90%"
                  h="50px"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Apellido:</FormLabel>
                <Input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleInputChange}
                  ref={lastNameRef}
                  bg={isEditing ? "light_gray" : "paleGray"}
                  isReadOnly={!isEditing}
                  focusBorderColor={error ? "red" : undefined}
                  borderColor="light_gray"
                  borderWidth="3px"
                  borderRadius="15px"
                  w="90%"
                  h="50px"
                />
              </FormControl>
            </HStack>
          </VStack>

          <VStack spacing={4} align="stretch">
            <HStack spacing={4} w="100%">
              <FormControl>
                <FormLabel>Correo:</FormLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  ref={emailRef}
                  bg={isEditing ? "light_gray" : "paleGray"}
                  isReadOnly={!isEditing}
                  focusBorderColor={error ? "red" : undefined}
                  borderColor="light_gray"
                  borderWidth="3px"
                  borderRadius="15px"
                  w="90%"
                  h="50px"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Nro. de Teléfono:</FormLabel>
                <Input
                  id="telephone"
                  type="tel"
                  name="telephone"
                  value={userData.telephone}
                  onChange={handleInputChange}
                  ref={telephoneRef}
                  bg={isEditing ? "light_gray" : "paleGray"}
                  isReadOnly={!isEditing}
                  focusBorderColor={error ? "red" : undefined}
                  borderColor="light_gray"
                  borderWidth="3px"
                  borderRadius="15px"
                  w="90%"
                  h="50px"
                />
              </FormControl>
            </HStack>
          </VStack>

          <Box mt={2} py={8}>
            {!isEditing ? (
            <Flex justify="flex-start" align="center" w="100%">
              <Button
                color="primary"
                _hover={{ bg: "light_gray" }}
                onClick={handleChangePassword}
              >
                Cambiar contraseña
              </Button>
            </Flex>
            ) : (
              <Flex justify="flex-end" align="center" width="100%" px={9}>
                  <HStack spacing={4}>
                    <Button
                      bg="gray"
                      color="black"
                      w="150px"
                      borderRadius="6px"
                      onClick={cancelEdit}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      bg="primary"
                      color="white"
                      w="150px"
                      borderRadius="6px"
                    >
                      Guardar Perfil
                    </Button>
                  </HStack>
              </Flex>
            )}
          </Box>
        </form>

        {role === 2 && (
          <VStack spacing={4} align="stretch">
            <HStack spacing={4} w="100%" align="center">
              <FormControl>
                <FormLabel htmlFor="area">Área:</FormLabel>
                <Input
                  id="area"
                  type="text"
                  name="area"
                  value={userData.departamentId || "no esta disponible"}
                  bg={isEditing ? "light_gray" : "paleGray"}
                  isReadOnly={!isEditing}
                  borderColor="light_gray"
                  borderWidth="3px"
                  borderRadius="15px"
                  w="90%"
                  h="50px"
                />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <HStack spacing={2}>
                  <FormLabel htmlFor="show-phone" mb="0">
                    Mostrar teléfono a alumnos:
                  </FormLabel>
                  <Switch id="show-phone" size="lg" mt={1} />
                </HStack>
              </FormControl>
            </HStack>
          </VStack>
        )}
      </Box>
    </Container>
  );
};

export default ProfileComponent;
