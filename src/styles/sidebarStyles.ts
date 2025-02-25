import styled from 'styled-components';

export const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #2d3436;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

export const SidebarMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
`;

export const SidebarMenuItem = styled.li`
  padding: 10px 20px;
  margin: 10px 0;
  cursor: pointer;
  background-color: #636e72;
  border-radius: 4px;
  text-align: center;

  &:hover {
    background-color: #b2bec3;
    color: #2d3436;
  }
`;
