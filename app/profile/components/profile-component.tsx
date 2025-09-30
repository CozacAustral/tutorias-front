import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Switch,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { UserService } from "../../../services/admin-service";
import { AuthService } from "../../../services/auth-service";
import { Department } from "../interfaces/departments.interface";
import { TutorPatchMe } from "../interfaces/tutor-patch-me.interface";

const jwt = require("jsonwebtoken");

const ProfileComponent = () => {
  const [role, setRole] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userData, setUserData] = useState<TutorPatchMe>({
    id: 0,
    name: "",
    email: "",
    lastName: "",
    telephone: "",
    departmentId: 0,
  });
  const [isDelete, setIsDelete] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [departments, setDepartments] = useState<Department[]>();

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

    if (!userData?.telephone) {
      setError("Debes ingresar el nuevo teléfono del tutor");
      telephoneRef.current?.focus();
      return;
    }

    if (!userData?.departmentId) {
      setError("Debes ingresar el nuevo departamento del tutor");
      departamentRef.current?.focus();
      return;
    }

    try {
      await UserService.tutorPatchMe(userData.id, userData);
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

    setUserData((prevState) => ({
      ...prevState,
      [name]: name === "departmentId" ? parseInt(value, 10) : value,
    }));
  };

  const handleDelete = async () => {
    try {
      await UserService.deleteUser(userData.id, password);
      toast({
        title: "Tutor Eliminado!",
        description: "El tutor fue eliminado con exito",
        duration: 1500,
        isClosable: true,
        status: "success",
      });
      onClose();
      Cookies.remove("authTokens", { path: "/" });
      router.push("/login");
    } catch (err) {
      console.error(err);
      setIsDelete(false);
      setError("El usuario no se pudo eliminar");
    }
  };

  const handleChangePassword = () => {
    router.push("/changePassword");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await AuthService.getUserInfo();
        if (data.deletedAt) {
          setIsDelete(true);
        }
        setUserData(data);
      } catch (error) {
        console.error("Error fetching tutor info:", error);
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
        mb={1}
      >
        Mi Perfil
      </Heading>
      <Box
        bg="white"
        w="800px"
        h="auto"
        p={6}
        boxShadow="md"
        borderRadius="20px"
      >
        {!isDelete ? (
          <>
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
              w="150"
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
          </>
        ) : null}

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
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
            marginBottom="17px"
            fontSize="17px"
          >
            {error}
          </Text>
        ) : undefined}

        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch" marginBottom="20px">
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
                  bg={isEditing ? "paleGray" : "light_gray"}
                  isReadOnly={!isEditing}
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
                  bg={isEditing ? "paleGray" : "light_gray"}
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
                <FormLabel>Correo:</FormLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  bg={"light_gray"}
                  value={userData.email}
                  isReadOnly
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
                  bg={isEditing ? "paleGray" : "light_gray"}
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
                  <FormLabel>Área:</FormLabel>
                  <Select
                    id="departmentId"
                    name="departmentId"
                    value={userData.departmentId}
                    onChange={handleInputChange}
                    bg={isEditing ? "paleGray" : "light_gray"}
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
                <FormControl
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                  mt={9}
                >
                  <HStack spacing={2}>
                    <FormLabel htmlFor="show-phone" mb="0">
                      Mostrar teléfono a alumnos:
                    </FormLabel>
                    <Switch id="show-phone" size="lg" />
                  </HStack>
                </FormControl>
              </HStack>
            </VStack>
          )}

          {isDelete ? null : (
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
          )}
        </form>
      </Box>
    </Container>
  );
};

export default ProfileComponent;
