// app/home/page.tsx
"use client";
import { Container } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthService } from "../../services/auth-service";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      const userInfo = await AuthService.getUserInfo();

      if (!userInfo || userInfo.status === 401 || userInfo.success === false) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    };

    verificarSesion();
  }, [router]);

  if (loading) return null;

  return (
    <Container
      width="100vw"
      height="100vh"
      backgroundImage="url('images/imagedashboard.png')"
      backgroundSize="contain"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
    />
  );
}
