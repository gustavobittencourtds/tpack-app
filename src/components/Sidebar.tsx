// Sidebar.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { SidebarContainer, SidebarMenu, SidebarMenuItem, LogoutButton } from '../styles/sidebarStyles';

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
    <SidebarContainer>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#ecf0f1' }}>TPACK Gestão</h2>
      <SidebarMenu>
        <SidebarMenuItem onClick={() => router.push('/admin')} active={router.pathname === '/admin'}>
          <FeatherIcon icon="home" /> Dashboard
        </SidebarMenuItem>
        <SidebarMenuItem onClick={() => router.push('/professors')} active={router.pathname === '/professors'}>
          <FeatherIcon icon="users" /> Professores
        </SidebarMenuItem>
      </SidebarMenu>
      <LogoutButton onClick={handleLogout}>
        <FeatherIcon icon="log-out" /> Logout
      </LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar;