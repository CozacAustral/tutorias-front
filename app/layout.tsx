"use client";
import { ChakraProvider } from "@chakra-ui/react";
import customTheme from "../styles/theme";
import SideBar from "../common/components/side-bar";
import { usePathname } from "next/navigation";
import "../styles/globals.css";
import { SidebarProvider } from "./contexts/SidebarContext";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();

  const noSideBarRoutes = ["/login", "/reset-password"];
  const shouldShowSideBar = !noSideBarRoutes.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <html lang="es">
      <body>
        <ChakraProvider theme={customTheme}>
          <SidebarProvider>
            <div className="container">
              {shouldShowSideBar && <SideBar />}
              <main className="content">{children}</main>
            </div>
          </SidebarProvider>
        </ChakraProvider>
      </body>
    </html>
  );
};

export default Layout;
