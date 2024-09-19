"use client";
import { Flex, Heading } from "@chakra-ui/react";
import ProfileComponent from "./components/profile-component";

const Profile = () => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bg="paleGray"
      position="relative"
    >
      <Heading
        as="h1"
        size="4xl"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="500"
        position="absolute"
        top="20px"
        left="20px"
        zIndex="5"
      >
        Mi Perfil
      </Heading>
      <ProfileComponent />
    </Flex>
  );
};

export default Profile;
