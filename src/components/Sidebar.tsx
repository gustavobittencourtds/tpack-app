// Sidebar.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import styles from '../styles/sidebarStyles.module.css';

const FeatherIcon = dynamic(() => import('feather-icons-react'), { ssr: false });

const Sidebar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (!isLoggedIn) return null;

  return (
    <div className={styles.sidebarContainer}>
      <Image src="/images/logo.svg" alt="TPACK App" width={65} height={65} style={{ borderRadius: '16px', marginBottom: '2rem' }} />
      <ul className={styles.sidebarMenu}>
        <li onClick={() => router.push('/admin')} className={`${styles.sidebarMenuItem} ${router.pathname === '/admin' ? styles.sidebarMenuItemActive : ''}`}>
          <FeatherIcon icon="home" /> Dashboard
        </li>
        <li onClick={() => router.push('/professors')} className={`${styles.sidebarMenuItem} ${router.pathname === '/professors' ? styles.sidebarMenuItemActive : ''}`}>
          <FeatherIcon icon="users" /> Professores
        </li>
      </ul>
      <button className={styles.logoutButton} onClick={handleLogout}>
        <FeatherIcon icon="log-out" /> Logout
      </button>
    </div>
  );
};

export default Sidebar;