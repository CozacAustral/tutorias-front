// TutorCreateModal.tsx
"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

interface TutorCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSuccess: () => void;
  createFn: (data: any) => Promise<void>;
}

export default function TutorCreateModal({
  isOpen,
  onClose,
  onCreateSuccess,
  createFn,
}: TutorCreateModalProps) {
  const toast = useToast();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    lastName: "",
    dni: "",
    birthdate: "",
    sex: "",
    telephone: "",
    yearEntry: "",
    category: "",
    dedication: "",
    dedicationDays: 0,
    departmentId: 0,
    countryId: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["dedicationDays", "departmentId", "countryId"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await createFn(formData);
      toast({
        title: "Tutor creado con éxito.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      onCreateSuccess();
      onClose();
      setFormData({
        email: "",
        name: "",
        lastName: "",
        dni: "",
        birthdate: "",
        sex: "",
        telephone: "",
        yearEntry: "",
        category: "",
        dedication: "",
        dedicationDays: 0,
        departmentId: 0,
        countryId: 0,
      });
    } catch (err) {
      console.error("Error al crear tutor", err);
      toast({
        title: "Error",
        description: "No se pudo crear el tutor.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Crear Tutor</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input name="email" value={formData.email} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input name="name" value={formData.name} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Apellido</FormLabel>
              <Input name="lastName" value={formData.lastName} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>DNI</FormLabel>
              <Input name="dni" value={formData.dni} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Fecha de nacimiento</FormLabel>
              <Input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Sexo</FormLabel>
              <Select name="sex" value={formData.sex} onChange={handleChange}>
                <option value="">Seleccionar</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Teléfono</FormLabel>
              <Input name="telephone" value={formData.telephone} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Año de ingreso</FormLabel>
              <Input type="date" name="yearEntry" value={formData.yearEntry} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Categoría</FormLabel>
              <Select name="category" value={formData.category} onChange={handleChange}>
                <option value="">Seleccionar</option>
                <option value="Adjunto">Adjunto</option>
                <option value="Titular">Titular</option>
                <option value="Ayudante">Ayudante</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Dedicación</FormLabel>
              <Select name="dedication" value={formData.dedication} onChange={handleChange}>
                <option value="">Seleccionar</option>
                <option value="Simple">Simple</option>
                <option value="Semi">Semi</option>
                <option value="Exclusiva">Exclusiva</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Días de dedicación</FormLabel>
              <Input type="number" name="dedicationDays" value={formData.dedicationDays} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Departamento</FormLabel>
              <Select name="departmentId" value={formData.departmentId} onChange={handleChange}>
                <option value="">Seleccionar departamento</option>
                <option value={19}>Department 1</option>
                <option value={20}>Department 2</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>País</FormLabel>
              <Select name="countryId" value={formData.countryId} onChange={handleChange}>
                <option value="">Seleccionar país</option>
                <option value={37}>Argentina</option>
                <option value={38}>Brasil</option>
                <option value={39}>Chile</option>
                <option value={40}>Paraguay</option>
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Crear
          </Button>
          <Button onClick={onClose} ml={3}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
