'use client';
import '../styles/globals.css';
import SideBar from '../common/components/SideBar';
import { usePathname } from 'next/navigation';

export default function Layout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="es">
      <body>
        <div className="container">
          {pathname !== '/Login' && <SideBar />}
          <main className="content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
