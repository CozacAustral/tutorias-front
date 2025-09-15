"use client";
import React from "react";
import { createStandaloneToast, UseToastOptions } from "@chakra-ui/react";
import AppToast, { AppToastStatus } from "../components/AppToast";



const { toast } = createStandaloneToast();

const DEFAULTS: UseToastOptions = {
  position: "top",
  duration: 4000,
  isClosable: true,
};

type ShowArgs = { title: string; description?: string };

function show(status: AppToastStatus, { title, description }: ShowArgs) {
  toast({
    ...DEFAULTS,
    render: ({ onClose }) => (
      <AppToast status={status} title={title} description={description} onClose={onClose} />
    ),
  });
}

export const toastSuccess = (args: ShowArgs) => show("success", args);
export const toastError   = (args: ShowArgs) => show("error", args);
export const toastInfo    = (args: ShowArgs) => show("info", args);
export const toastWarn    = (args: ShowArgs) => show("warning", args);