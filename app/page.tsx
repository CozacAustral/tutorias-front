
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "../services/auth-service";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const verificarSesion = async () => {
      const userInfo = await AuthService.getUserInfo();

      if (!userInfo || userInfo.status === 401 || userInfo.success === false) {
        router.replace("/login");
      } else {
        router.replace("/home");
      }
    };

    verificarSesion();
  }, [router]);

  return null;
}
