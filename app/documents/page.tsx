"use client";

import {
  DeleteIcon,
  EditIcon,
  ExternalLinkIcon,
  SmallAddIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Td,
  Tr,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import GenericTable from "../../common/components/generic-table";
import { DocumentService } from "../../services/document-service";
import { useSidebar } from "../contexts/SidebarContext";
import ConfirmDialog from "../reuniones/modals/confirm-dialog-modal";
import { Document } from "./interfaces/document.interface";
import CreateDocumentModal from "./modals/create-document.modal";
import EditDocumentModal from "./modals/edit-document.modal";
import ViewDocumentModal from "./modals/view-document.modal";

const DocumentsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [role, setRole] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { collapsed } = useSidebar();
  const toast = useToast();

  const loadDocuments = useCallback(
    async (p: number, search: string) => {
      setLoading(true);
      try {
        const res = await DocumentService.getDocuments(p, limit, search);
        setDocuments(res.data ?? []);
        setTotal(res.total ?? 0);
        setPage(p);
      } catch (err: any) {
        toast({
          title: "Error cargando documentos",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [limit, toast]
  );

  useEffect(() => {
    setIsClient(true);
    try {
      const Cookies = require("js-cookie");
      const jwt = require("jsonwebtoken");
      const token = Cookies.get("authTokens");
      if (token) {
        const payload = jwt.decode(token);
        setRole(payload?.role ?? null);
      }
    } catch (error) {
      console.error("Error al decodificar el token:", error);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      loadDocuments(1, "");
    }
  }, [isClient, loadDocuments]);

  const isAdmin = role === 1;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);

  const openCreate = () => setIsCreateOpen(true);
  const openEdit = (id: string) => {
    setActiveId(id);
    setIsEditOpen(true);
  };
  const openView = (id: string) => {
    setActiveId(id);
    setIsViewOpen(true);
  };
  const openConfirmDelete = (id: string) => {
    setToDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!toDeleteId) return;
    try {
      await DocumentService.deleteDocument(toDeleteId);
      toast({ title: "Documento eliminado", status: "success" });
      setIsConfirmOpen(false);
      loadDocuments(page, searchTerm);
    } catch (err) {
      toast({ title: "Error al eliminar documento", status: "error" });
    }
  };

  const renderDocumentRow = (doc: any) => (
    <Tr key={doc.id}>
      <Td fontWeight="medium">{doc.name}</Td>
      <Td>
        {doc.url ? (
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#318AE4", textDecoration: "underline" }}
          >
            <HStack spacing={1}>
              <ExternalLinkIcon />
              <span>Link al archivo</span>
            </HStack>
          </a>
        ) : (
          "—"
        )}
      </Td>
      <Td fontSize="sm">
        {isClient ? new Date(doc.updatedAt || doc.createdAt).toLocaleString() : ""}
      </Td>
      <Td>
        <IconButton
          icon={<ViewIcon boxSize={5} />}
          aria-label="Ver"
          backgroundColor="white"
          onClick={() => openView(doc.id)}
          _hover={{
            borderRadius: 15,
            backgroundColor: "#318AE4",
            color: "white",
          }}
        />
        {isAdmin && (
          <>
            <IconButton
              icon={<EditIcon boxSize={5} />}
              aria-label="Editar"
              backgroundColor="white"
              onClick={() => openEdit(doc.id)}
              ml={2}
              _hover={{
                borderRadius: 15,
                backgroundColor: "#318AE4",
                color: "white",
              }}
            />
            <IconButton
              icon={<DeleteIcon boxSize={5} />}
              aria-label="Eliminar"
              backgroundColor="white"
              onClick={() => openConfirmDelete(doc.id)}
              ml={2}
              _hover={{
                borderRadius: 15,
                backgroundColor: "red.500",
                color: "white",
              }}
            />
          </>
        )}
      </Td>
    </Tr>
  );

  return (
    <>
      <Box pl={collapsed ? "6.5rem" : "17rem"} px={5} py={6} minH="100vh">
        {documents ? (
          <GenericTable
            caption="Documentos"
            data={documents}
            currentPage={page}
            totalItems={total}
            itemsPerPage={limit}
            onPageChange={(newPage) => {
              setPage(newPage);
              loadDocuments(newPage, searchTerm);
            }}
            searchTerm={searchTerm}
            onSearch={(term) => {
              const cleanTerm = term.trim();
              setSearchTerm(cleanTerm);
              loadDocuments(1, cleanTerm);
            }}
            filter={false}
            showAddMenu={false}
            topRightComponent={
              isAdmin ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<SmallAddIcon />}
                    backgroundColor="gray.200" 
                    color="gray.700"
                    borderRadius="10px"
                    px={6}
                    _hover={{
                      backgroundColor: "gray.300",
                      transform: "translateY(-1px)",
                    }}
                    _active={{
                        backgroundColor: "gray.300",
                    }}
                  >
                    Crear
                  </MenuButton>
                  <MenuList borderRadius="10px">
                    <MenuItem onClick={openCreate}>
                      Agregar Documento
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : undefined
            }
            actions={false}
            TableHeader={["Nombre", "URL", "Fecha Última Actualización", "Acciones"]}
            renderRow={renderDocumentRow}
          />
        ) : (
          <p>Cargando...</p>
        )}
      </Box>

      <CreateDocumentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={() => loadDocuments(1, "")}
      />

      <EditDocumentModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        documentId={activeId}
        onUpdated={() => loadDocuments(page, searchTerm)}
      />

      <ViewDocumentModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        documentId={activeId}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Confirmar eliminación"
        body={<div>¿Estás seguro de que deseas eliminar este documento?</div>}
      />
    </>
  );
};

export default DocumentsPage;
