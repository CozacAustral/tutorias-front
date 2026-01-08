import {
  Box,
  Button,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import GenericTable from "../../../common/components/generic-table";
import { SubjectCareerWithState } from "../interfaces/subject-career-student.interface";

interface SubjectStudentModal<t = any> {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => Promise<void> | void;
  entityName: string;
  titleCareer: string | undefined;
  subjects: SubjectCareerWithState[];
  renderSubjectNow?: (
    subject: SubjectCareerWithState,
    index: number
  ) => React.ReactNode;
  state?: boolean | null;
  role?: number | null;
  showButtonCancelSave?: boolean;
}

const SubjectModal: React.FC<SubjectStudentModal> = ({
  isOpen,
  onClose,
  onConfirm,
  entityName,
  titleCareer,
  subjects,
  renderSubjectNow,
  showButtonCancelSave = true,
}) => {
  const itemsPerPage = useBreakpointValue({
    base: 3,
    md: 4,
    notebook: 5,
    desktop: 8,
  });

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
        <Flex justifyContent="flex-start" alignItems="center">
          <Text
            fontSize="35px"
            color="black"
            marginTop="40px"
            marginLeft={10}
            marginRight={8}
            marginBottom={1}
          >
            <Text as="span" fontWeight="bold">
              {showButtonCancelSave ? "Editar: " : "Ver: "}
            </Text>
            {titleCareer}
          </Text>
        </Flex>

        <ModalCloseButton />

        <ModalBody
          paddingY={10}
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
                      filter={false}
                      data={subjects}
                      TableHeader={
                        showButtonCancelSave
                          ? [
                              "Materia",
                              "Año",
                              "Estado",
                              "Ultima fecha de actualización",
                              "Acciones",
                            ]
                          : [
                              "Materia",
                              "Año",
                              "Estado",
                              "Ultima fecha de actualización",
                            ]
                      }
                      caption={entityName}
                      renderRow={
                        renderSubjectNow ??
                        ((subject: SubjectCareerWithState, index: number) => (
                          <tr key={subject.subjectId ?? index}>
                            <td>{subject.subjectName}</td>
                            <td>{subject.year}</td>
                            <td>{subject.subjectState}</td>
                            <td>
                              {new Date(subject.updateAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      }
                      compact={false}
                      itemsPerPage={itemsPerPage}
                      showAddMenu={false}
                      isInModal
                      subjectModalEdit
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
                      actions={showButtonCancelSave}
                    />
                  </Box>
                </HStack>
              </VStack>
            </HStack>
          </VStack>
        </ModalBody>

        {showButtonCancelSave ? (
          <ModalFooter justifyContent="flex-end" position="sticky" gap={3}>
            <Button variant="ghost" onClick={onClose} mr={3}>
              Cancelar
            </Button>
            <Button bg="primary" color="white" onClick={() => onConfirm?.()}>
              Guardar
            </Button>
          </ModalFooter>
        ) : null}
      </ModalContent>
    </Modal>
  );
};

export default SubjectModal;
