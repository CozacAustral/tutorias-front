"use client";
import { Flex, Heading } from "@chakra-ui/react";
import ProfileComponent from "./components/profile-component";

const Profile = () => {
  return (
    <Flex
      height="100vh"
      bg="paleGray"
      flexDirection="column"
      pl={{ base: "0", md: "250px" }}
    >
      <Flex
        justifyContent="flex-start"
        alignItems="center"
        mt="20px"
        ml="20px"
        zIndex="5"
      >
        <Heading
          as="h1"
          size="3xl"
          fontFamily="'Montserrat', sans-serif"
          fontWeight="500"
        >
          Mi Perfil
        </Heading>
      </Flex>
      <Flex justifyContent="center" alignItems="center" flex="1">
        <ProfileComponent />
      </Flex>
    </Flex>
  );
};

export default Profile;
