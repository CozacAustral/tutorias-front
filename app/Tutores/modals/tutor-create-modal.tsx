"use client";

import GenericCreateModal from "../../administradores/modals/create-modal-admin";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreateSuccess: () => void;
  createFn: (data: any) => Promise<void>;
}

const tutorFields = [
  { name: "email", label: "Email", type: "email", required: true },
  { name: "password", label: "Contraseña", type: "password", required: true },
  { name: "name", label: "Nombre", required: true },
  { name: "lastName", label: "Apellido", required: true },
];

export default function TutorCreateModal({
  isOpen,
  onClose,
  onCreateSuccess,
  createFn,
}: Props) {
  return (
    <GenericCreateModal
      isOpen={isOpen}
      onClose={onClose}
      onCreateSuccess={onCreateSuccess}
      title="Tutor"
      fields={tutorFields}
      createFn={(formData: {
        email: string;
        password: string;
        name: string;
        lastName: string;
      }) =>
        createFn({
          user: {
            ...formData,
            roleId: 2, 
          },
        })
      }
    />
  );
}
