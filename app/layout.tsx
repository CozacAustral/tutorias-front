"use client";
import { ChakraProvider } from "@chakra-ui/react";
import customTheme from "../styles/theme";
import SideBar from "../common/components/side-bar";
import { usePathname } from "next/navigation";
import "../styles/globals.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Head, Html } from "next/document";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = Cookies.get("authTokens");

    if (!token && pathname !== "/Login") {
      router.push("/Login");
    } else {
      setLoading(true)
    }
  }, [pathname, router]);

  if (!loading){
    return null;
  }

  return (
    <html lang="es">
      <body>
        <ChakraProvider theme={customTheme}>
          <div className="container">
            {pathname !== "/Login" && <SideBar />}
            <main className="content">{children}</main>
          </div>
        </ChakraProvider>
      </body>
    </html>
  );
};

export default Layout;
