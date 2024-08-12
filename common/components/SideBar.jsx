'use client';
import { useState } from 'react';
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { ArrowForwardIcon, ArrowBackIcon } from "@chakra-ui/icons";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const isActiveLink = (href) => {
    return pathname === href;
  };

  return (
    <Flex direction="row" height="100vh">
      <Flex
        direction="column"
        align="center"
        bg="#14218D"
        width={collapsed ? "6.5rem" : "17rem"}
        transition="width 0.5s ease-in-out"
        justifyContent="space-between"
        position="fixed"
        left="0"
        top="0"
        height="100vh"
        zIndex="1"
      >
        <Box w="100%">
          <Box display="flex" alignItems="center" justifyContent="center" py="1rem" mb="1rem">
            <Image
              src={collapsed ? "/images/collapsedaustral.png" : "/images/image%20austral.png"}
              width={collapsed ? 75.52 : 200}
              height={collapsed ? 90.54 : 75}
              alt='logo'
              priority
            />
          </Box>
          <Flex direction="column" as="ul" listStyleType="none" p={0}>
            <Box as="li" mb="1rem">
              <Link href="/Administradores" passHref style={{ textDecoration:"none" }}>
                <Flex
                  align="center"
                  p="0.8rem 1rem"
                  bg={isActiveLink('/Administradores') ? "#318AE4" : "#14218D"}
                  color={isActiveLink('/Administradores') ? "white" : "#fff3e9"}
                  borderRadius="10px"
                  transition="background-color 0.1s ease-in-out"
                  _hover={{ bg: "#318AE4", color: "white" }}
                  justifyContent={collapsed ? "center" : "flex-start"}
                >
                  <Image
                    src='/icons/Administradores-icon.svg'
                    width={30}
                    height={30}
                    alt=''
                    priority
                  />
                  {!collapsed && <Text ml="0.5rem">Administradores</Text>}
                </Flex>
              </Link>
            </Box>
            <Box as="li" mb="1rem">
              <Link href="/Tutores" passHref style={{ textDecoration:"none" }}>
                <Flex
                  align="center"
                  p="0.8rem 1rem"
                  bg={isActiveLink('/Tutores') ? "#318AE4" : "#14218D"}
                  color={isActiveLink('/Tutores') ? "white" : "#fff3e9"}
                  borderRadius="10px"
                  transition="background-color 0.1s ease-in-out"
                  _hover={{ bg: "#318AE4", color: "white" }}
                  justifyContent={collapsed ? "center" : "flex-start"}
                >
                  <Image
                    src='/icons/tutors-icon.svg'
                    width={30}
                    height={30}
                    alt=''
                    priority
                  />
                  {!collapsed && <Text ml="0.5rem">Tutores</Text>}
                </Flex>
              </Link>
            </Box>
            <Box as="li" mb="1rem">
              <Link href="/Alumnos" passHref style={{ textDecoration:"none" }} >
                <Flex
                  align="center"
                  p="0.8rem 1rem"
                  bg={isActiveLink('/Alumnos') ? "#318AE4" : "#14218D"}
                  color={isActiveLink('/Alumnos') ? "white" : "#fff3e9"}
                  borderRadius="10px"
                  transition="background-color 0.1s ease-in-out"
                  _hover={{ bg: "#318AE4", color: "white" }}
                  justifyContent={collapsed ? "center" : "flex-start"}
                >
                  <Image
                    src='/icons/student-icon.svg'
                    width={30}
                    height={30}
                    alt=''
                    priority
                  />
                  {!collapsed && <Text ml="0.5rem">Alumnos</Text>}
                </Flex>
              </Link>
            </Box>
            <Box as="li" mb="1rem">
              <Link href="/Reuniones" passHref style={{ textDecoration:"none" }}>
                <Flex
                  align="center"
                  p="0.8rem 1rem"
                  bg={isActiveLink('/Reuniones') ? "#318AE4" : "#14218D"}
                  color={isActiveLink('/Reuniones') ? "white" : "#fff3e9"}
                  borderRadius="10px"
                  transition="background-color 0.1s ease-in-out"
                  _hover={{ bg: "#318AE4", color: "white" }}
                  justifyContent={collapsed ? "center" : "flex-start"}
                >
                  <Image
                    src='/icons/Reuniones-icon.svg'
                    width={30}
                    height={30}
                    alt=''
                    priority
                  />
                  {!collapsed && <Text ml="0.5rem">Reuniones</Text>}
                </Flex>
              </Link>
            </Box>
          </Flex>
        </Box>
        <Box mb="1rem">
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
      <Box
        ml={collapsed ? "6.5rem" : "17rem"}
        flex="1"
        p="4"
        height="100vh"
      >
        {}
      </Box>
    </Flex>
  );
};

export default SideBar;
