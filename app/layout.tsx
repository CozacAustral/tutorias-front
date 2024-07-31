import SideBar from "../common/components/SideBar";
import "../styles/globals.css";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html>
      <body>
        <div className="container">
          <SideBar />
          <div className="content">{children}</div>
        </div>
      </body>
    </html>
  );
};

export default Layout;
