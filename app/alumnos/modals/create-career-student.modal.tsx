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
  FormErrorMessage,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
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
  const [touchedYear, setTouchedYear] = useState(false);

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const yearIsValid = useMemo(() => {
    const y = Number(careerData.yearOfAdmission);
    return Number.isFinite(y) && y >= currentYear;
  }, [careerData.yearOfAdmission, currentYear]);

  const canSubmit = useMemo(() => {
    const careerOk = Number(careerData.careerId) > 0;
    const yearOk = yearIsValid;
    return careerOk && yearOk && !error;
  }, [careerData.careerId, yearIsValid, error]);

const validateYear = () => {
  const raw = careerData.yearOfAdmission;

  if (raw == null) {
    setError("El año es obligatorio.");
    return false;
  }

  const y = typeof raw === "string" ? Number(raw) : raw;

  if (!Number.isFinite(y)) {
    setError("El año es inválido.");
    return false;
  }

  if (y < currentYear) {
    setError(`El año debe ser ${currentYear} o mayor.`);
    return false;
  }

  setError("");
  return true;
};

  useEffect(() => {
    if (!touchedYear) return;
    validateYear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [careerData.yearOfAdmission, touchedYear, currentYear]);

  const handleConfirm = async () => {
    setTouchedYear(true);
    if (!validateYear()) return;
    await onConfirm();
  };

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
              <FormControl isRequired mt={4} isInvalid={touchedYear && !!error}>
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
                  placeholder="Ingrese el año en que empezó a cursar"
                  focusBorderColor={touchedYear && error ? "red" : undefined}
                  min={currentYear}
                  onBlur={() => {
                    setTouchedYear(true);
                    validateYear();
                  }}
                  onFocus={() => {
                    // opcional: marcar como touched al tocar el campo
                    // setTouchedYear(true);
                  }}
                />
                {touchedYear && error ? (
                  <FormErrorMessage>{error}</FormErrorMessage>
                ) : null}
              </FormControl>
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            mr={3}
            type="button"
            onClick={handleConfirm}
            isDisabled={!canSubmit}
          >
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CareerModal;
