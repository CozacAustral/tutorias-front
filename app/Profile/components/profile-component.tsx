import { EditIcon } from "@chakra-ui/icons";
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
  Select,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { AuthService } from "../../../services/auth-service";
import { PatchTutor } from "../../interfaces/patchTutor.interface";
import { UserService } from "../../../services/admin-service";
import { Deparment } from "../../interfaces/departments.interface";

const jwt = require("jsonwebtoken");

const ProfileComponent = () => {
  const [role, setRole] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userData, setUserData] = useState<PatchTutor>({
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
  const [departments, setDepartments] = useState<Deparment[]>();

  const toast = useToast();
  const router = useRouter();

  const nameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const telephoneRef = useRef<HTMLInputElement>(null);
  const departamentRef = useRef<HTMLInputElement>(null);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userData?.name) {
      setError("Debes ingresar el nuevo nombre del tutor");
      nameRef.current?.focus();
      return;
    }

    if (!userData?.lastName) {
      setError("Debes ingresar el nuevo apellido del tutor");
      lastNameRef.current?.focus();
      return;
    }

    if (!userData?.email) {
      setError("Debes ingresar el nuevo mail del tutor");
      emailRef.current?.focus();
      return;
    }

    if (!userData?.telephone) {
      setError("Debes ingresar el nuevo teléfono del tutor");
      telephoneRef.current?.focus();
      return;
    }

    if (!userData?.departamentId) {
      setError("Debes ingresar el nuevo departamento del tutor");
      departamentRef.current?.focus();
      return;
    }

    try {
      // await UserService.patchMeUser(userData);
      setSuccess(true);
      toast({
        title: "Tutor editado",
        description: "El tutor fue editado con exito",
        duration: 3000,
        isClosable: true,
        status: "success",
      });
      setIsEditing(false);
    } catch (error) {
      setError("Error al actualizar el tutor");
      setSuccess(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const saveChanges = () => {
    setIsEditing(false);
    toast({
      title: "Tu perfil fue actualizado con éxito",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
  };

  const handleDelete = () => {
    setIsDelete(true);
    onClose();
  };

  const handleChangePassword = () => {
    router.push("/changePassword");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await AuthService.getUserInfo();
        console.log("User data:", data);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAllDepartments = async () => {
      try {
        const departments = await UserService.fetchAllDepartments();
        setDepartments(departments);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    const token = Cookies.get("authTokens");
    console.log("TOKEN FROM COOKIE: ", token);
    if (!token) {
      console.log("No token found");
      return;
    }

    try {
      const decodedToken = jwt.decode(token);
      console.log("Decoded token:", decodedToken);
      setRole(decodedToken?.role);
    } catch (error) {
      console.error("Error decoding token:", error);
    }

    fetchUserData();
    fetchAllDepartments();
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
          <Text
            color="red"
            textAlign="center"
            marginBottom="30px"
            fontSize="19px"
          >
            {error}
          </Text>
        ) : undefined}

        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch" marginBottom="20px">
            <HStack spacing={4} w="100%">
              <FormControl>
                <FormLabel htmlFor="nombre">Nombre:</FormLabel>
                <Input
                  id="nombre"
                  type="text"
                  name="nombre"
                  borderColor="light_gray"
                  value={userData.name || "Nombre no existente"}
                  onChange={handleInputChange}
                  bg={isEditing ? "light_gray" : "paleGray"}
                  isReadOnly={!isEditing}
                  borderWidth="3px"
                  borderRadius="15px"
                  w="90%"
                  h="50px"
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="apellido">Apellido:</FormLabel>
                <Input
                  id="apellido"
                  type="text"
                  name="apellido"
                  value={userData.lastName || "Apellido no existente"}
                  onChange={handleInputChange}
                  bg={isEditing ? "light_gray" : "paleGray"}
                  isReadOnly={!isEditing}
                  borderColor="light_gray"
                  borderWidth="3px"
                  borderRadius="15px"
                  w="90%"
                  h="50px"
                />
              </FormControl>
            </HStack>
          </VStack>

          <VStack spacing={4} align="stretch" marginBottom="20px">
            <HStack spacing={4} w="100%">
              <FormControl>
                <FormLabel htmlFor="email">Correo:</FormLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={userData.email || "correo no encontrado"}
                  onChange={handleInputChange}
                  bg="paleGray"
                  isReadOnly
                  borderColor="light_gray"
                  borderWidth="3px"
                  borderRadius="15px"
                  w="90%"
                  h="50px"
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="tel">Nro. de Teléfono:</FormLabel>
                <Input
                  id="tel"
                  type="tel"
                  name="tel"
                  value={userData.telephone || "numero no encontrado"}
                  onChange={handleInputChange}
                  bg={isEditing ? "light_gray" : "paleGray"}
                  isReadOnly={!isEditing}
                  borderColor="light_gray"
                  borderWidth="3px"
                  borderRadius="15px"
                  w="90%"
                  h="50px"
                />
              </FormControl>
            </HStack>
          </VStack>

          {role === 2 && (
            <VStack spacing={4} align="stretch">
              <HStack spacing={4} w="99%">
                <FormControl>
                  <FormLabel htmlFor="area">Área:</FormLabel>
                  <Select
                    id="area"
                    name="area"
                    value={userData.departamentId || "no esta disponible"}
                    onChange={handleInputChange}
                    bg={isEditing ? "light_gray" : "paleGray"}
                    isReadOnly={!isEditing}
                    borderColor="light_gray"
                    borderWidth="3px"
                    borderRadius="15px"
                    w="90%"
                    h="50px"
                  >
                    {departments?.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl display="flex" justifyContent="flex-start" alignItems="center" mt={9}>
                  <HStack spacing={2}>
                    <FormLabel htmlFor="show-phone" mb="0">
                      Mostrar teléfono a alumnos:
                    </FormLabel>
                    <Switch id="show-phone" size="lg"/>
                  </HStack>
                </FormControl>
              </HStack>
            </VStack>
          )}

          <Box mt={8} py={6}>
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
                    Editar Perfil
                  </Button>
                </HStack>
              </Flex>
            )}
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default ProfileComponent;
