"use client";
import { ChakraProvider } from "@chakra-ui/react";
import customTheme from "../styles/theme";
import SideBar from "../common/components/side-bar";
import { usePathname } from "next/navigation";
import "../styles/globals.css";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();

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
