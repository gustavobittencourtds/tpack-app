import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { SidebarContainer, SidebarMenu, SidebarMenuItem, LogoutButton } from '../styles/sidebarStyles';

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

  if (!isLoggedIn) {
    return null; // Não renderiza a sidebar se o usuário não estiver logado
  }

  return (
    <SidebarContainer>
      <SidebarMenu>
        <SidebarMenuItem onClick={() => router.push('/admin')}>Dashboard</SidebarMenuItem>
        <SidebarMenuItem onClick={() => router.push('/professors')}>Professores</SidebarMenuItem>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </SidebarMenu>
    </SidebarContainer>
  );
};

export default Sidebar;
