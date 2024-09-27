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
  
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
const jwt = require("jsonwebtoken");

const ProfileComponent = () => {
  const [role, setRole] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDelete, setIsDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState("");
  const toast = useToast();
  const router = useRouter();

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const cancelEdit = () => {
    setIsEditing(false);
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
    console.log("password:", password);
    setIsDelete(true);
    onClose();
  };

  const handleChangePassword = () => {
    router.push("/changePassword");
  };

  useEffect(() => {
    const token = Cookies.get("authTokens");
    if (!token) return console.log("No token found");

    try {
      const decodedToken = jwt.decode(token);
      setRole(decodedToken.role);
    } catch (error) {
      console.error("Error al decodificar el token:", error);
    }
  }, []);

  return (
    <Container maxWidth="1200px" w="100%" h="auto" p={4}>
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

        <VStack spacing={4} align="stretch">
          <HStack spacing={4} w="100%">
            <FormControl>
              <FormLabel htmlFor="nombre">Nombre:</FormLabel>
              <Input
                id="nombre"
                type="text"
                name="nombre"
                borderColor="light_gray"
                defaultValue="Juan"
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
                defaultValue="Perez"
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

        <VStack spacing={4} align="stretch">
          <HStack spacing={4} w="100%">
            <FormControl>
              <FormLabel htmlFor="email">Correo:</FormLabel>
              <Input
                id="email"
                type="email"
                name="email"
                defaultValue="JPerez@mail.austral.edu.ar"
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
                defaultValue="+54 341 213 7585"
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

        {(role === 1 || role === 2) && (
          <VStack spacing={4} align="stretch">
            <HStack spacing={4} w="100%" align="center">
              <FormControl>
                <FormLabel htmlFor="area">Área:</FormLabel>
                <Input
                  id="area"
                  type="text"
                  name="area"
                  defaultValue="Matemáticas"
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
                  <Switch id="show-phone" size="lg" mt="2px" />
                </HStack>
              </FormControl>
            </HStack>
          </VStack>
        )}

        <Button
          color="primary"
          w="160px"
          _hover={{ bg: "light_gray" }}
          borderRadius="20px"
          mt={4}
          onClick={handleChangePassword}
        >
          Cambiar contraseña
        </Button>

        <Flex direction="row" justify="flex-end" p={4}>
          {isEditing && (
            <HStack spacing={4}>
              <Button
                bg="gray"
                color="black"
                w="150px"
                h="40px"
                borderRadius="6px"
                onClick={cancelEdit}
              >
                Cancelar
              </Button>
              <Button
                bg="primary"
                color="white"
                w="150px"
                h="40px"
                borderRadius="6px"
                onClick={saveChanges}
              >
                Guardar Perfil
              </Button>
            </HStack>
          )}
        </Flex>
      </Box>
    </Container>
  );
};

export default ProfileComponent;
