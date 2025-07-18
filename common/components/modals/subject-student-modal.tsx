import { Box, Button, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Text, VStack } from "@chakra-ui/react";
import GenericTable from "../generic-table";
import { SubjectCareerWithState } from "../../../app/interfaces/subject-career-student.interface";

interface SubjectStudentModal<t = any> {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    entityName: string;
    titleCareer: string | undefined;
    subjects: SubjectCareerWithState[]
    renderSubjectNow: (career: any, index: number) => React.ReactNode
}


const SubjectModal: React.FC<SubjectStudentModal> = ({
    isOpen,
    onClose,
    onConfirm,
    entityName,
    titleCareer,
    subjects,
    renderSubjectNow,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent maxW="990px" maxH="95vh" width='100%'>
                <Text fontSize="35px" color='black' marginTop='40px' marginLeft={8} marginRight={8} marginBottom={1}>
                    <Text as='span' fontWeight='bold' >Editar: </Text>{titleCareer}
                </Text>
                <ModalCloseButton />
                <ModalBody paddingY={6}>
                    <VStack spacing={4} align='stretch'>
                        <HStack spacing={4} width='100%'>
                            <Box mt={3} overflowX='auto'>
                                <GenericTable
                                    data={subjects}
                                    TableHeader={['Materia', 'Año', 'Estado', 'Ultima fecha de actualización']}
                                    caption={entityName}
                                    renderRow={renderSubjectNow}
                                    compact={false}
                                    itemsPerPage={10}
                                    showAddMenu={false}
                                    minH='undefined'
                                    paddingX={3}
                                    paddingY={3}
                                    fontSize="50px"
                                    marginLeft="3px"
                                    marginTop="1"
                                    width="100%"
                                    maxWidth="100%"
                                    padding={2}
                                    flex='undefined'
                                    height="555px"
                                    widthTable={900}
                                />
                            </Box>
                        </HStack>
                    </VStack>
                </ModalBody>

                <ModalFooter justifyContent='flex-end' pt={2} pb={10} mt='auto' position='sticky' bottom={0} zIndex={10} gap={3}>
                    <Button variant="ghost" onClick={onClose} mr={3}>
                        Cancelar
                    </Button>
                    <Button bg="primary" color="white" onClick={onConfirm}>
                        Guardar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default SubjectModal;