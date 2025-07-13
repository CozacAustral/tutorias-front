"use client";
import { Flex } from "@chakra-ui/react";
import ProfileComponent from "./components/profile-component";

const Profile = () => {
  return (
    <Flex
      height="100vh"
      bg="paleGray"
      flexDirection="column"
      pl={{ base: "0", md: "250px" }}
    >
      <Flex justifyContent="center" alignItems="center" flex="1">
        <ProfileComponent />
      </Flex>
    </Flex>
  );
};

export default Profile;
