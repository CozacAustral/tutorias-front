"use client";
import React from "react";
import {
  Box, HStack, VStack, Text, Icon, CloseButton, useColorModeValue,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon, InfoIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { AppToastProps } from "../interfaces/app-toast-props.interface";
import { AppToastStatus } from '../type/app-toast-status.type';

const statusConfig: Record<
  AppToastStatus,
  { icon: any; accent: string; bg: string; fg: string }
> = {
  success: { icon: CheckCircleIcon, accent: "#16a34a", bg: "green.50", fg: "green.900" },
  error:   { icon: WarningTwoIcon,  accent: "#ff0000ff", bg: "#fc8080ff",   fg: "red.900" },
  info:    { icon: InfoIcon,        accent: "#2563eb", bg: "blue.50",  fg: "blue.900" },
  warning: { icon: WarningIcon,     accent: "#d97706", bg: "yellow.50",fg: "yellow.900" },
};

const AppToast: React.FC<AppToastProps> = ({ status, title, description, onClose }) => {
  const cfg = statusConfig[status];
  const bg = useColorModeValue(cfg.bg, "gray.800");
  const border = useColorModeValue(`${cfg.accent}33`, `${cfg.accent}55`);
  const fgTitle = useColorModeValue(cfg.fg, "white");
  const fgDesc = useColorModeValue("gray.700", "gray.200");

  return (
    <Box
      w="full"
      maxW="520px"
      mx="auto"
      borderRadius="xl"
      bg={bg}
      border="1px solid"
      borderColor={border}
      boxShadow="lg"
      p={4}
    >
      <HStack align="flex-start" spacing={3}>
        <Icon as={cfg.icon} boxSize={6} color={cfg.accent} mt={1} />
        <VStack align="start" spacing={1} flex={1}>
          <Text fontWeight="semibold" color={fgTitle}>{title}</Text>
          {description ? <Text fontSize="sm" color={fgDesc}>{description}</Text> : null}
        </VStack>
        <CloseButton onClick={onClose} />
      </HStack>
    </Box>
  );
};

export default AppToast;
