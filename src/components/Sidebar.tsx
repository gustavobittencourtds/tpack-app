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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      router.push('/login');
    }

    // Fechar o menu ao mudar de rota
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!isLoggedIn) return null;

  return (
    <>
      {/* Botão hamburger - visível apenas em dispositivos móveis */}
      <button
        className={`${styles.hamburgerButton} ${isMobileMenuOpen ? styles.hamburgerButtonOpen : ''}`}
        onClick={toggleMobileMenu}
        aria-label="Menu"
      >
        <FeatherIcon icon={isMobileMenuOpen ? "x" : "menu"} size={24} />
      </button>

      {/* Overlay para fechar o menu quando clicar fora (mobile) */}
      {isMobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={toggleMobileMenu} />
      )}

      {/* Sidebar - adaptada para desktop e mobile */}
      <div className={`${styles.sidebarContainer} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <Image src="/images/logo.svg" alt="TPACK App" width={65} height={65} style={{ borderRadius: '16px', marginBottom: '2rem' }} />
        <ul className={styles.sidebarMenu}>
          <li onClick={() => router.push('/admin')} className={`${styles.sidebarMenuItem} ${router.pathname === '/admin' ? styles.sidebarMenuItemActive : ''}`}>
            <FeatherIcon icon="home" /> Rodadas de Avaliação
          </li>
          <li onClick={() => router.push('/professors')} className={`${styles.sidebarMenuItem} ${router.pathname === '/professors' ? styles.sidebarMenuItemActive : ''}`}>
            <FeatherIcon icon="users" /> Professores
          </li>
        </ul>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <FeatherIcon icon="log-out" /> Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;