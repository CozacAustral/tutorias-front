"use client";

import GenericCreateModal from "./create-modal-admin";



interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreateSuccess: () => void;
  createFn: (data: any) => Promise<void>;
}

const tutorFields = [
  { name: "name", label: "Nombre", required: true },
  { name: "lastName", label: "Apellido", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "telephone", label: "Teléfono", type: "tel" },
  { name: "password", label: "Contraseña", type: "password", required: true },
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
        thelephone?: string;
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
