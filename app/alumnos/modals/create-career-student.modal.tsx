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
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { Career } from "../interfaces/career.interface";
import { AssignedCareer } from "../interfaces/create-career.interface";

interface CreateCareerModal<t = any> {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  careerData: AssignedCareer;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  careers: Career[];
}

const CareerModal: React.FC<CreateCareerModal> = ({
  isOpen,
  onClose,
  onConfirm,
  handleChange,
  careerData,
  careers,
}) => {
  const [error, setError] = useState("");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent maxW="51vw">
        <ModalHeader>Asignar nueva carrera</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4} w="100%">
              <FormControl isRequired mt={4}>
                <FormLabel>Carrera</FormLabel>
                <Select
                  name="careerId"
                  borderColor="light_gray"
                  bg="Very_Light_Gray"
                  borderWidth="4px"
                  borderRadius="15px"
                  w="100%"
                  h="50px"
                  value={careerData.careerId}
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
                  name="yearOfAdmission"
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
