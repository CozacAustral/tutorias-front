import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  HStack,
  useToast,
  Select,
} from "@chakra-ui/react";
import { UserService } from "../../../services/admin-service";
import { Career } from "../../../app/interfaces/career.interface";
import { Country } from "../../../app/interfaces/country.interface";
import { UpdateStudentDto } from "../../../app/interfaces/update-student";

interface EditModalProps<t = any> {
  isOpen: boolean;
  onClose: () => void;
  entityName: string;
  title: string;
  onConfirm: () => Promise<void>;
  formData: { [key: string]: t };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  fieldLabels?: { [key: string]: string };
  careerData?: { name: string; year: number; status: string };
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  entityName,
  formData,
  onInputChange,
  careerData,
  fieldLabels,
}) => {


  const toast = useToast();

  const keys = Object.keys(formData);

  const [careers, setCareers] = useState<Career[]>([]);
  const [countries, setCountries] = useState<Country[]>([])


  useEffect(() => {
    const loadCareers = async () => {
      try {
        const data = await UserService.fetchAllCareers()
        setCareers(data)
      } catch (error) {
        toast({
          title: 'Errro al cargar las carreras',
          status: 'error'
        });
      }
    };

    const loadCountries = async () => {
      try {
        const data = await UserService.fetchAllCountries()
        setCountries(data)
      } catch (error) {
        toast({
          title: 'Error al cargar los paises de los estudiantes',
          status: 'error'
        });
      }
    }
    if (isOpen) {
      loadCountries();
      loadCareers();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent maxW="51vw">
        <ModalHeader>
          <Text fontSize="2xl" fontWeight="bold">
            Editar {entityName}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {keys.map((field, index) => {
            const isEven = index % 2 === 0;
            const nextField = keys[index + 1];
            return isEven ? (
              <HStack spacing={4} key={field} mt={4}>
                <FormControl>
                  <FormLabel>{fieldLabels?.[field] || field}</FormLabel> {/*nombre del campo */}
                  {field === 'countryId' && (
                    <Select
                      name="countryId"
                      borderColor="light_gray"
                      bg="Very_Light_Gray"
                      borderWidth="4px"
                      borderRadius="15px"
                      h="50px"
                      value={formData.countryId}
                      onChange={onInputChange}
                    >
                      {countries.map((country) => (
                        <option key={country.id} value={country.id.toString()}>
                          {country.name}
                        </option>
                      ))}
                    </Select>
                  )}
                  {field === 'careersId' && (
                    <Select
                      name="careersId"
                      borderColor="light_gray"
                      bg="Very_Light_Gray"
                      borderWidth="4px"
                      borderRadius="15px"
                      h="50px"
                      value={formData.careersId}
                      onChange={onInputChange}
                    >
                      {careers.map((career) => (
                        <option key={career.id} value={career.id.toString()}>
                          {career.name}
                        </option>
                      ))}
                    </Select>
                  )}
                  {field !== 'countryId' && field !== 'careersId' && (
                    typeof formData[field] === 'string' && (formData[field] as string).includes('-') ? (
                      <Input
                        type="date"
                        borderColor="light_gray"
                        bg="light_gray"
                        borderWidth="4px"
                        borderRadius="15px"
                        w="100%"
                        h="50px"
                        name={field}
                        value={formData[field] as string}
                        onChange={onInputChange}
                      />
                    ) : (
                      <Input
                        name={field}
                        borderColor="light_gray"
                        bg="light_gray"
                        borderWidth="4px"
                        borderRadius="15px"
                        w="100%"
                        h="50px"
                        value={formData[field] as string | number}
                        onChange={onInputChange}
                      />
                    )
                  )}
                </FormControl>
                {nextField && (
                  <FormControl>
                    <FormLabel>{fieldLabels?.[nextField] || nextField}</FormLabel>
                    {nextField === 'countryId' && (
                      <Select
                        name="countryId"
                        borderColor="light_gray"
                        bg="Very_Light_Gray"
                        borderWidth="4px"
                        borderRadius="15px"
                        h="50px"
                        value={formData.countryId}
                        onChange={onInputChange}
                      >
                        <option value="">Seleccionar país</option>
                        {countries.map((country) => (
                          <option key={country.id} value={country.id.toString()}>
                            {country.name}
                          </option>
                        ))}
                      </Select>
                    )}
                    {nextField === 'careersId' && (
                      <Select
                        name="careersId"
                        borderColor="light_gray"
                        bg="Very_Light_Gray"
                        borderWidth="4px"
                        borderRadius="15px"
                        h="50px"
                        value={formData.careersId}
                        onChange={onInputChange}
                      >
                        {careers.map((career) => (
                          <option key={career.id} value={career.id.toString()}>
                            {career.name}
                          </option>
                        ))}
                      </Select>
                    )}
                    {nextField !== 'countryId' && nextField !== 'careersId' && (
                      typeof formData[nextField] === 'string' && (formData[nextField] as string).includes('-') ? (
                        <Input
                          type="date"
                          borderColor="light_gray"
                          bg="light_gray"
                          borderWidth="4px"
                          borderRadius="15px"
                          w="100%"
                          h="50px"
                          name={nextField}
                          value={formData[nextField] as string}
                          onChange={onInputChange}
                        />
                      ) : (
                        <Input
                          name={nextField}
                          borderColor="light_gray"
                          bg="light_gray"
                          borderWidth="4px"
                          borderRadius="15px"
                          w="100%"
                          h="50px"
                          value={formData[nextField] as string | number}
                          onChange={onInputChange}
                        />
                      )
                    )}
                  </FormControl>
                )}
              </HStack>
            ) : null;
          })}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose} mr={3}>
            Cancelar
          </Button>
          <Button bg="primary" color="white" onClick={onConfirm}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal >
  );
};

export default EditModal;
