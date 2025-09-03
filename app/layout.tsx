"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import SideBar from "../common/components/side-bar";
import "../styles/globals.css";
import customTheme from "../styles/theme";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();

  const noSideBarRoutes = ["/login", "/reset-password"];
  const isRoot = pathname === "/";
  const shouldShowSideBar = !isRoot && !noSideBarRoutes.includes(pathname);

  return (
    <html lang="es">
      <body>
        <ChakraProvider theme={customTheme}>
          <div className="container">
            {shouldShowSideBar && <SideBar />}
            <main className="content">{children}</main>
          </div>
        </ChakraProvider>
      </body>
    </html>
  );
};

export default Layout;
