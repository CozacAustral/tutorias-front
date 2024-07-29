"use client";
import { useState } from "react";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { ArrowForwardIcon, ArrowBackIcon } from "@chakra-ui/icons";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const SideBar: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const currentPath = usePathname();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const isActiveLink = (href: string): boolean => currentPath === href;

  return (
    <Flex>
      <Flex
        direction="column"
        align="center"
        bg="#14218D"
        height="100vh"
        width={collapsed ? "6.5rem" : "17rem"}
        transition="width 0.5s ease-in-out"
        justifyContent="space-between"
        position="fixed"
        left="0"
        top="0"
        zIndex="1"
      >
        <Box w="100%">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            py="1rem"
            mb="1rem"
          >
            <Image
              src={
                collapsed
                  ? "/images/collapsedaustral.png"
                  : "/images/image%20austral.png"
              }
              width={collapsed ? 75.52 : 200}
              height={collapsed ? 90.54 : 75}
              alt="logo"
              priority
            />
          </Box>
          <Flex direction="column" as="ul" listStyleType="none" p={0}>
            <Box as="li" mb="1rem">
              <Link
                href="/Administradores"
                passHref
                style={{ textDecoration: "none" }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  p="0.8rem 1rem"
                  bg={isActiveLink("/Administradores") ? "#318AE4" : "#14218D"}
                  color={isActiveLink("/Administradores") ? "white" : "#fff3e9"}
                  borderRadius="10px"
                  transition="background-color 0.1s ease-in-out"
                  _hover={{
                    bg: "#318AE4",
                    color: "white",
                    textDecoration: "none",
                  }}
                  justifyContent={collapsed ? "center" : "flex-start"}
                >
                  <Image
                    src="/icons/Administradores-icon.svg"
                    width={30}
                    height={30}
                    alt=""
                    priority
                  />
                  {!collapsed && <Text ml="0.5rem">Administradores</Text>}
                </Box>
              </Link>
            </Box>
            <Box as="li" mb="1rem">
              <Link href="/Tutores" passHref style={{ textDecoration: "none" }}>
                <Box
                  display="flex"
                  alignItems="center"
                  p="0.8rem 1rem"
                  bg={isActiveLink("/Tutores") ? "#318AE4" : "#14218D"}
                  color={isActiveLink("/Tutores") ? "white" : "#fff3e9"}
                  borderRadius="10px"
                  transition="background-color 0.1s ease-in-out"
                  _hover={{
                    bg: "#318AE4",
                    color: "white",
                    textDecoration: "none",
                  }}
                  justifyContent={collapsed ? "center" : "flex-start"}
                  textDecorationLine="none"
                >
                  <Image
                    src="/icons/tutors-icon.svg"
                    width={30}
                    height={30}
                    alt=""
                    priority
                  />
                  {!collapsed && <Text ml="0.5rem">Tutores</Text>}
                </Box>
              </Link>
            </Box>
            <Box as="li" mb="1rem">
              <Link href="/Alumnos" passHref style={{ textDecoration: "none" }}>
                <Box
                  display="flex"
                  alignItems="center"
                  p="0.8rem 1rem"
                  bg={isActiveLink("/Alumnos") ? "#318AE4" : "#14218D"}
                  color={isActiveLink("/Alumnos") ? "white" : "#fff3e9"}
                  borderRadius="10px"
                  transition="background-color 0.1s ease-in-out"
                  _hover={{ bg: "#318AE4", color: "white" }}
                  justifyContent={collapsed ? "center" : "flex-start"}
                  textDecoration="none"
                >
                  <Image
                    src="/icons/student-icon.svg"
                    width={30}
                    height={30}
                    alt=""
                    priority
                  />
                  {!collapsed && <Text ml="0.5rem">Alumnos</Text>}
                </Box>
              </Link>
            </Box>
            <Box as="li" mb="1rem">
              <Link
                href="/Reuniones"
                passHref
                style={{ textDecoration: "none" }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  p="0.8rem 1rem"
                  bg={isActiveLink("/Reuniones") ? "#318AE4" : "#14218D"}
                  color={isActiveLink("/Reuniones") ? "white" : "#fff3e9"}
                  borderRadius="10px"
                  transition="background-color 0.1s ease-in-out"
                  _hover={{ bg: "#318AE4", color: "white" }}
                  justifyContent={collapsed ? "center" : "flex-start"}
                  outline="none"
                >
                  <Image
                    src="/icons/Reuniones-icon.svg"
                    width={30}
                    height={30}
                    alt=""
                    priority
                  />
                  {!collapsed && <Text ml="0.5rem">Reuniones</Text>}
                </Box>
              </Link>
            </Box>
          </Flex>
        </Box>
        <Box className="container_toggle_sidebar_button" mb="1rem">
          <IconButton
            color="white"
            bg="#318AE4"
            boxSize="50px"
            fontSize="20px"
            icon={collapsed ? <ArrowForwardIcon /> : <ArrowBackIcon />}
            onClick={toggleSidebar}
            aria-label="Toggle SideBar"
            borderRadius="50%"
            border="none"
          />
        </Box>
      </Flex>
      <Box ml={collapsed ? "6.5rem" : "17rem"}></Box>
    </Flex>
  );
};

export default SideBar;
