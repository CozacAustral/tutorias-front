"use client";
import { Flex } from "@chakra-ui/react";
import ProfileComponent from "./components/profile-component";

const Profile = () => {
  return (
    <Flex height="100vh" bg="paleGray" flexDirection="column">
      <Flex justifyContent="center" alignItems="center" flex="1" mx="auto">
        <ProfileComponent />
      </Flex>
    </Flex>
  );
};

export default Profile;
