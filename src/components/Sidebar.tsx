import React from 'react';
import { useRouter } from 'next/router';
import { SidebarContainer, SidebarMenu, SidebarMenuItem } from '../styles/sidebarStyles';

const Sidebar = () => {
  const router = useRouter();

  return (
    <SidebarContainer>
      <SidebarMenu>
        <SidebarMenuItem onClick={() => router.push('/admin')}>Dashboard</SidebarMenuItem>
        <SidebarMenuItem onClick={() => router.push('/professors')}>Professores</SidebarMenuItem>
      </SidebarMenu>
    </SidebarContainer>
  );
};

export default Sidebar;
