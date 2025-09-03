import { useEffect, useState } from "react";
import { Student } from "../../../app/interfaces/student.interface";
import { Button, FormControl, FormLabel, HStack, IconButton, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast, VStack } from "@chakra-ui/react";
import { UserService } from "../../../services/admin-service";
import { FaGraduationCap } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface viewStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: Student | null;
}


const ViewStudentModal: React.FC<viewStudentModalProps> = ({isOpen, onClose, student}) => {
    const [studentData, setStudentData] = useState<Student | null>(null)
    const toast = useToast();
    const router = useRouter();


    useEffect(() => {
        const loadStudentData = async () => {
            if(!student || !student.id) return
        try {
            const data = await UserService.fetchStudentById(student.id);
            setStudentData(data);
        } catch (error) {
            toast({
            title: "Error",
            description: `No se pudo obtener el estudiante con ID ${student.id}.`,
            status: "error",
            duration: 5000,
            isClosable: true,
            });
            console.error("Error al obtener el estudiante:", error);
        }};
    
        if (isOpen) {
            loadStudentData();
        } else {
            setStudentData(null); 
        }
    }, [isOpen, student, toast]);


    return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay/>
        <ModalContent maxW="52vw">
            <ModalHeader fontSize="2xl" fontWeight="bold">Ver Alumno</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
            <VStack spacing={4} align="stretch">
            <HStack spacing={4} w="100%">
                <FormControl>
                    <FormLabel>Nombre</FormLabel>
                    <Input
                    type="text"
                    borderColor="light_gray"
                    bg="light_gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={studentData?.user.name || ""}
                    isReadOnly
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Apellido/s</FormLabel>
                    <Input
                    type="text"
                    borderColor="light_gray"
                    bg="light_gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={studentData?.user.lastName || ""}
                    isReadOnly
                    />
                </FormControl>
            </HStack>
            <HStack spacing={4} w="100%">
            <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                    type="text"
                    borderColor="light_gray"
                    bg="light_gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={studentData?.user.email || ""}
                    isReadOnly
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Telefono</FormLabel>
                    <Input
                    type="text"
                    borderColor="light_gray"
                    bg="light_gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={studentData?.telephone || ""}
                    isReadOnly
                    />
                </FormControl>
            </HStack>
            <HStack spacing={4} w="100%">
            <FormControl>
                    <FormLabel>DNI</FormLabel>
                    <Input
                    type="text"
                    borderColor="light_gray"
                    bg="light_gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={studentData?.dni || ""}
                    isReadOnly
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Direccion</FormLabel>
                    <Input
                    type="text"
                    borderColor="light_gray"
                    bg="light_gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={studentData?.address || ""}
                    isReadOnly
                    />
                </FormControl>
            </HStack>
            <HStack spacing={4} w="100%">
            <FormControl>
                    <FormLabel>Pais</FormLabel>
                    <Input
                    type="text"
                    borderColor="light_gray"
                    bg="light_gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={studentData?.countryId || ""}
                    isReadOnly
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Carrera</FormLabel>
                    <InputGroup>
                    <Input
                    type="text"
                    borderColor="light_gray"
                    bg="light_gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    isReadOnly
                    />
                    <InputRightElement display="flex" alignItems="center" justifyContent="center" mt='4px'>
                    <IconButton
                    icon={<FaGraduationCap size={27}/>}
                    aria-label="ir a carrera"
                    onClick={() => router.push('/Carrera')}
                    bg='transparent'
                    size='sm'
                    borderRadius="full"
                    _hover={{ bg: 'primary',  color: 'white'}} 
                    
                    />
                    </InputRightElement>
                    </InputGroup>
                </FormControl>
            </HStack>
            <HStack>
            <FormControl>
                    <FormLabel>Obsevaciones</FormLabel>
                    <Input
                    type="text"
                    borderColor="light_gray"
                    bg="light_gray"
                    borderWidth="4px"
                    borderRadius="15px"
                    w="100%"
                    h="50px"
                    value={studentData?.observations || ""}
                    isReadOnly
                    />
                </FormControl>
            </HStack>
            </VStack>
            </ModalBody>
            <ModalFooter>
            <Button  bg='primary' color= 'white' onClick={onClose}>
                Volver
            </Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
    )
}

export default ViewStudentModal