import { ChangeEvent, useState } from "react";
import { CreateCareer } from "../../../app/interfaces/create-career.interface";
import { Button, FormControl, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, VStack } from "@chakra-ui/react";

interface CreateCareerModal<t = any> {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    careerData: CreateCareer
    handleChange: (e : React.ChangeEvent<HTMLInputElement>) => void
}


const CareerModal: React.FC<CreateCareerModal> = ({
    isOpen,
    onClose,
    onConfirm,
    handleChange,
    careerData
}) => {

    const [error, setError] = useState('')

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
                                <FormLabel>Nombre de carrera</FormLabel>
                                <Input
                                    name="name"
                                    borderColor="light_gray"
                                    bg="Very_Light_Gray"
                                    borderWidth="4px"
                                    borderRadius="15px"
                                    w="100%"
                                    h="50px"
                                    value={careerData.name}
                                    onChange={handleChange}
                                    placeholder="Ingrese el nombre de carrera"
                                    focusBorderColor={error ? 'red' : undefined}
                                />
                            </FormControl>
                        </HStack>
                    </VStack>

                    <VStack spacing={4} align="stretch">
                        <HStack spacing={4} w="100%">
                            <FormControl isRequired mt={4}>
                                <FormLabel>Año de inicio de carrera</FormLabel>
                                <Input
                                    name="yearOfThePlan"
                                    type="number"
                                    borderColor="light_gray"
                                    bg="Very_Light_Gray"
                                    borderWidth="4px"
                                    borderRadius="15px"
                                    w="100%"
                                    h="50px"
                                    value={careerData.yearOfThePlan}
                                    onChange={handleChange}
                                    placeholder="Ingrese el año en que empezo a cursar"
                                    focusBorderColor={error ? 'red' : undefined}
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
    )
}

export default CareerModal;