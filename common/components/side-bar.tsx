"use client";
import { useState, useEffect } from "react";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import {
  ArrowForwardIcon,
  ArrowBackIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
const jwt = require("jsonwebtoken");
import Cookies from "js-cookie";
import { useSidebar } from "../../app/contexts/SidebarContext";

const SideBar = () => {
  const { collapsed, toggleSidebar } = useSidebar();
  const [role, setRole] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("authTokens");
    if (token) {
      try {
        const decodedToken = jwt.decode(token);
        setRole(decodedToken.role);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.log("No token found");
    }
  }, []);

  const isActiveLink = (href: string): boolean => {
    return pathname === href;
  };

  const handleLogout = () => {
    Cookies.remove("authTokens", { path: "/" });
    router.push("/login");
  };

  return (
    <Flex
      direction="column"
      align="center"
      bg="primary"
      width={collapsed ? "4rem" : "10.5rem"}
      transition="width 0.3s ease-in-out"
      justifyContent="space-between"
      position="fixed"
      left="0"
      top="0"
      height="100vh"
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
                : "/images/australsidebar.png"
            }
            width={collapsed ? 40 : 140} 
            height={collapsed ? 40 : 60}
            alt="logo"
            priority
          />
        </Box>
        <Flex direction="column" as="ul" listStyleType="none" p={0}>
          <Box as="li" mb="1rem">
            <Link href="/profile" passHref style={{ textDecoration: "none" }}>
              <Flex
                align="center"
                p="0.5rem"
                bg={isActiveLink("/profile") ? "secondary" : "primary"}
                color={isActiveLink("/profile") ? "white" : "#fff3e9"}
                borderRadius="10px"
                transition="background-color 0.1s ease-in-out"
                _hover={{ bg: "#318AE4", color: "white" }}
                justifyContent={collapsed ? "center" : "flex-start"}
              >
                <Image
                  src="/icons/MyProfile.svg"
                  width={30}
                  height={30}
                  alt="Profile"
                  priority
                />
                {!collapsed && <Text ml="0.5rem">Mi Perfil</Text>}
              </Flex>
            </Link>
          </Box>

          <Box as="li" mb="1rem">
            <Link href="/reuniones" passHref style={{ textDecoration: "none" }}>
              <Flex
                align="center"
                p="0.5rem"
                bg={isActiveLink("/reuniones") ? "secondary" : "primary"}
                color={isActiveLink("/reuniones") ? "white" : "#fff3e9"}
                borderRadius="6px"
                transition="background-color 0.1s ease-in-out"
                _hover={{ bg: "secondary", color: "white" }}
                justifyContent={collapsed ? "center" : "flex-start"}
              >
                <Image
                  src="/icons/Reuniones-icon.svg"
                  width={30}
                  height={30}
                  alt="Reuniones"
                  priority
                />
                {!collapsed && <Text ml="0.5rem">Reuniones</Text>}
              </Flex>
            </Link>
          </Box>

          {role === 1 && (
            <>
              <Box as="li" mb="1rem">
                <Link
                  href="/administradores"
                  passHref
                  style={{ textDecoration: "none" }}
                >
                  <Flex
                    align="center"
                    p="0.5rem"
                    bg={
                      isActiveLink("/administradores") ? "secondary" : "primary"
                    }
                    color={
                      isActiveLink("/administradores") ? "white" : "#fff3e9"
                    }
                    borderRadius="10px"
                    transition="background-color 0.1s ease-in-out"
                    _hover={{ bg: "secondary", color: "white" }}
                    justifyContent={collapsed ? "center" : "flex-start"}
                  >
                    <Image
                      src="/icons/Administradores-icon.svg"
                      width={30}
                      height={30}
                      alt="Administradores"
                      priority
                    />
                    {!collapsed && <Text ml="0.5rem">Administradores</Text>}
                  </Flex>
                </Link>
              </Box>

              <Box as="li" mb="1rem">
                <Link
                  href="/tutores"
                  passHref
                  style={{ textDecoration: "none" }}
                >
                  <Flex
                    align="center"
                    p="0.5rem"
                    bg={isActiveLink("/tutores") ? "secondary" : "primary"}
                    color={isActiveLink("/tutores") ? "white" : "#fff3e9"}
                    borderRadius="10px"
                    transition="background-color 0.1s ease-in-out"
                    _hover={{ bg: "#318AE4", color: "white" }}
                    justifyContent={collapsed ? "center" : "flex-start"}
                  >
                    <Image
                      src="/icons/tutors-icon.svg"
                      width={30}
                      height={30}
                      alt="Tutores"
                      priority
                    />
                    {!collapsed && <Text ml="0.5rem">Tutores</Text>}
                  </Flex>
                </Link>
              </Box>
            </>
          )}

          {(role === 1 || role === 2) && (
            <>
              <Box as="li" mb="1rem">
                <Link
                  href="/alumnos-asignados"
                  passHref
                  style={{ textDecoration: "none" }}
                >
                  <Flex
                    align="center"
                    p="0.5rem"
                    bg={
                      isActiveLink("/alumnosAsignados")
                        ? "secondary"
                        : "primary"
                    }
                    color={
                      isActiveLink("/alumnosAsignados") ? "white" : "#fff3e9"
                    }
                    borderRadius="6px"
                    transition="background-color 0.1s ease-in-out"
                    _hover={{ bg: "secondary", color: "white" }}
                    justifyContent={collapsed ? "center" : "flex-start"}
                  >
                    <Image
                      src="/icons/alumnos-asignados.svg"
                      width={30}
                      height={30}
                      alt="Alumnos asignados"
                      priority
                    />
                    {!collapsed && <Text ml="0.5rem">Alumnos asignados</Text>}
                  </Flex>
                </Link>
              </Box>

              <Box as="li" mb="1rem">
                <Link
                  href="/alumnos"
                  passHref
                  style={{ textDecoration: "none" }}
                >
                  <Flex
                    align="center"
                    p="0.5rem"
                    bg={isActiveLink("/alumnos") ? "secondary" : "primary"}
                    color={isActiveLink("/alumnos") ? "white" : "#fff3e9"}
                    borderRadius="6px"
                    transition="background-color 0.1s ease-in-out"
                    _hover={{ bg: "secondary", color: "white" }}
                    justifyContent={collapsed ? "center" : "flex-start"}
                  >
                    <Image
                      src="/icons/student-icon.svg"
                      width={30}
                      height={30}
                      alt="Alumnos"
                      priority
                    />
                    {!collapsed && <Text ml="0.5rem">Alumnos</Text>}
                  </Flex>
                </Link>
              </Box>
            </>
          )}
        </Flex>
      </Box>
      <Box
        mb="1rem"
        display="flex"
        flexDirection="column"
        alignItems="center"
        pb="1rem"
      >
        <IconButton
          color="white"
          bg="secondary"
          boxSize="50px"
          fontSize="25px"
          icon={collapsed ? <ArrowForwardIcon /> : <ArrowBackIcon />}
          onClick={toggleSidebar}
          aria-label="Toggle SideBar"
          borderRadius="50%"
          border="none"
          mb="1rem"
          display="flex"
          flexDirection={collapsed ? "column" : "row"}
          alignItems="center"
        />
        <IconButton
          color="white"
          bg="red"
          boxSize="50px"
          fontSize="20px"
          icon={<ExternalLinkIcon />}
          onClick={handleLogout}
          aria-label="Logout"
          borderRadius="50%"
          border="none"
          mb="1rem"
        />
      </Box>
    </Flex>
  );
};

export default SideBar;
