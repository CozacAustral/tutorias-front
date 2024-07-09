'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

const SideBar = () => {
    const [collapsed, setCollapsed] = useState(true);
    const router = useRouter();
    const currentPath = usePathname();


const toggleSidebar = () => {
    setCollapsed(!collapsed);
};

  // const handleMouseEnter = () => {
  //   setCollapsed(false);
  // };

  // const handleMouseLeave = () => {
  //   setCollapsed(true);
  // };

const isActiveLink = (href) => currentPath === href

return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className='sidebar_top'>
        <Image
        src={collapsed ? "/images/collapsedaustral.png" : "/images/image%20austral.png"}
        width={collapsed ? 75.52 : 200}
        height={collapsed ? 90.54 : 75}
        className='Sidebar_logo'
        alt='logo'
        priority
        />
        </div>
        <ul className='sidebar_list'>
        {/* <li className='sidebar_item'>
        <Link href="/" className={`sidebar_link ${isActiveLink('/') ? 'active' : ''}`}>
            <span className={`sidebar_text ${collapsed ? 'hidden' : ''}`}>Home</span>
        </Link>
        </li> */}
        <li className='sidebar_item'>
        <Link href="/Administradores" className={`sidebar_link ${isActiveLink('/Administradores') ? 'active' : ''}`}>
            <div>
            <Image
                src='/icons/Administradores-icon.svg'
                width={30}
                height={30}
                className='sidebar_icon'
                alt=''
                priority={true}
            />
            </div>
            <span className={`sidebar_text ${collapsed ? 'hidden' : ''}`}>Administradores</span>
        </Link>
        </li>
        <li className='sidebar_item'>
        <Link href="/Tutores" className={`sidebar_link ${isActiveLink('/Tutores') ? 'active' : ''}`}>
            <div>
            <Image
                src='/icons/tutors-icon.svg'
                alt=''
                width={30}
                height={30}
                className='sidebar_icon'
            />
            </div>
            <span className={`sidebar_text ${collapsed ? 'hidden' : ''}`}>Tutores</span>
        </Link>
        </li>
        <li className='sidebar_item'>
        <Link href="/Alumnos" className={`sidebar_link ${isActiveLink('/Alumnos') ? 'active' : ''}`}>
            <div>
            <Image
                src='/icons/student-icon.svg'
                alt='Alumnos'
                className='sidebar_icon'
                width={30}
                height={30}
            />
            </div>
            <span className={`sidebar_text ${collapsed ? 'hidden' : ''}`}>Alumnos</span>
        </Link>
        </li>
        <li className='sidebar_item'>
        <Link href="/Reuniones" className={`sidebar_link ${isActiveLink('/Reuniones') ? 'active' : ''}`}>
            <div>
            <Image
                src='/icons/Reuniones-icon.svg'
                alt='Alumnos'
                width={30}
                height={30}
                className='sidebar_icon'
            />
            </div>
            <span className={`sidebar_text ${collapsed ? 'hidden' : ''}`}>Reuniones</span>
        </Link>
        </li>
    </ul>
    {/* <div className={'container_sidebar_button_back'}>
        <button type='button' onClick={() => router.back()} className='sidebar_button_back'>
        ←
        </button>
      </div> */}
    <div className="container_toggle_sidebar_button">
    <button type='button' onClick={toggleSidebar} className='toggle_sidebar_button'>
        {collapsed ? '  ⭢' : '←'}
    </button>
    </div>
    
    </aside>
);
};

export default SideBar;
