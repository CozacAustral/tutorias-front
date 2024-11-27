import { redirect } from "next/navigation";
import { Container } from "@chakra-ui/react";

export default function Page() {
  const isAuthenticated = true;

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <Container
      width="100vw"
      height="100vh"
      backgroundImage="url('/images/imagedashboard.png')"
      backgroundSize="contain"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
    ></Container>
  );
}
