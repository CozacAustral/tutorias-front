import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import GenericTable from "../generic-table";
import { SubjectCareerWithState } from "../../../app/interfaces/subject-career-student.interface";
import { useBreakpointValue } from '@chakra-ui/react';

interface SubjectStudentModal<t = any> {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  entityName: string;
  titleCareer: string | undefined;
  subjects: SubjectCareerWithState[];
  renderSubjectNow: (career: any, index: number) => React.ReactNode;
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
    const itemsPerPage = useBreakpointValue({ notebook: 4 , lg: 8});
    
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        maxW="80vw"
        maxH="98vh"
        display="flex"
        flexDirection="column"
        padding={0}
      >
        <Text
          fontSize="35px"
          color="black"
          marginTop="40px"
          marginLeft={10}
          marginRight={8}
          marginBottom={1}
        >
          <Text as="span" fontWeight="bold">
            Editar:{" "}
          </Text>
          {titleCareer}
        </Text>
        <ModalCloseButton />
        <ModalBody
          paddingY={2}
          flex="1"
          display="flex"
          flexDirection="column"
          minH={0}
        >
          <VStack spacing={6} align="stretch" flex="1">
            <HStack spacing={4} align="flex-start">
              <VStack spacing={4} align="stretch" flex={2}>
                <HStack spacing={4} flexWrap="wrap">
                  <Box
                    width="100%"
                    flex="1"
                    overflow="hidden"
                    display="flex"
                    flexDirection="column"
                  >
                    <GenericTable
                      data={subjects}
                      TableHeader={[
                        "Materia",
                        "Año",
                        "Estado",
                        "Ultima fecha de actualización",
                      ]}
                      caption={entityName}
                      renderRow={renderSubjectNow}
                      compact={true}
                      itemsPerPage={itemsPerPage}
                      showAddMenu={false}
                      isInModal={true}
                      subjectModalEdit={true}
                      minH="auto"
                      paddingX={3}
                      paddingY={3}
                      fontSize="2x1"
                      marginLeft="-1px"
                      marginTop="0"
                      width="100%"
                      maxWidth="100%"
                      padding={2}
                      height="100%"
                    />
                  </Box>
                </HStack>
              </VStack>
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter
          justifyContent="flex-end"
          pt={2}
          pb={9}
          mt="auto"
          position="sticky"
          bottom={0}
          zIndex={10}
          gap={3}
        >
          <Button variant="ghost" onClick={onClose} mr={3}>
            Cancelar
          </Button>
          <Button bg="primary" color="white" onClick={onConfirm}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SubjectModal;
