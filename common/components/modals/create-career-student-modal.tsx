import { ChangeEvent, useEffect, useState } from "react";
import { CreateCareer } from "../../../app/interfaces/create-career.interface";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Toast,
  VStack,
} from "@chakra-ui/react";
import { UserService } from "../../../services/admin-service";
import { Career } from "../../../app/interfaces/career.interface";

interface CreateCareerModal<t = any> {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  careerData: CreateCareer;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const CareerModal: React.FC<CreateCareerModal> = ({
  isOpen,
  onClose,
  onConfirm,
  handleChange,
  careerData,
}) => {
  const [error, setError] = useState("");
  const [careers, setCareers] = useState<Career[]>([]);

  useEffect(() => {
    const loadCareers = async () => {
      try {
        const data = await UserService.fetchAllCareers();
        setCareers(data);
      } catch (error) {
        Toast({
          title: "Error al cargar las carreras",
          status: "error",
        });
      }
      if (isOpen) {
        loadCareers();
      }
    };
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent maxW="51vw">
        <ModalHeader>Crear Carrera</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4} w="100%">
              <FormControl isRequired mt={4}>
                <FormLabel>Carrera</FormLabel>
                <Select
                  name="careerData.name"
                  borderColor="light_gray"
                  bg="Very_Light_Gray"
                  borderWidth="4px"
                  borderRadius="15px"
                  w="100%"
                  h="50px"
                  value={careerData.name}
                  onChange={handleChange}
                  placeholder="Seleccione una carrera"
                  focusBorderColor={error ? "red" : undefined}
                >
                  {careers.map((career) => (
                    <option key={career.id} value={career.id}>
                      {career.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </HStack>
          </VStack>

          <VStack spacing={4} align="stretch">
            <HStack spacing={4} w="100%">
              <FormControl isRequired mt={4}>
                <FormLabel>Año de inicio de carrera</FormLabel>
                <Input
                  name="careerData.yearOfAdmission"
                  type="number"
                  borderColor="light_gray"
                  bg="Very_Light_Gray"
                  borderWidth="4px"
                  borderRadius="15px"
                  w="100%"
                  h="50px"
                  value={careerData.yearOfAdmission}
                  onChange={handleChange}
                  placeholder="Ingrese el año en que empezo a cursar"
                  focusBorderColor={error ? "red" : undefined}
                />
              </FormControl>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="blue" mr={3} type="submit" onClick={onConfirm}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CareerModal;
