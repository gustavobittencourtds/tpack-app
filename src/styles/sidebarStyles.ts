import styled from 'styled-components';

export const SidebarContainer = styled.div`
  width: 260px;
  background:rgb(102, 116, 130);
  color: #ecf0f1;
  padding: 1.5rem;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: sticky;
  max-height: 100vh;
  top: 0;
`;

export const SidebarMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
`;

export const SidebarMenuItem = styled.li<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  margin: 8px 0;
  cursor: pointer;
  background: ${({ active }) => (active ? '#6c5ce7' : 'transparent')};
  border-radius: 8px;
  transition: background 0.3s;

  &:hover {
    background: #6c5ce7;
  }

  svg {
    margin-right: 12px;
    width: 20px;
    height: 20px;
  }
`;

export const LogoutButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #e84118;
  }

  svg {
    margin-right: 8px;
  }
`;