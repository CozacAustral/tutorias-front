import SideBar from '../common/components/SideBar.jsx';
import '../styles/globals.css'


const Layout = ( { children }) => {
  return (
    <html>
      <body>
      <div className='container'>
        <SideBar/>
        {children}
      </div>
      </body>
    </html>
  )
}

export default Layout;