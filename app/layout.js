'use client'
import { ChakraProvider } from '@chakra-ui/react';
import customTheme from '../styles/theme';
import SideBar from '../common/components/SideBar';
import { usePathname } from 'next/navigation';
import '../styles/globals.css';

 const Layout = ({ children }) => {
  const pathname = usePathname();
  
  return (
    <html lang="es">
      <body>
        <ChakraProvider theme={customTheme}>
          <div className="container">
            {pathname !== '/Login' && <SideBar />}
            <main className="content" bg='paleGray'>
              {children}
            </main>
          </div>
        </ChakraProvider>
      </body>
    </html>
  );
}

export default Layout;